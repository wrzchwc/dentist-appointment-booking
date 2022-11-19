/*eslint no-unused-vars: 0*/
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { DateService } from 'src/app/shared/_services/date.service';
import { LengthService } from 'src/app/shared/_services/appointments/length.service';
import { AppointmentCartService } from '../appointment-cart/appointment-cart.service';
import { AppointmentsService } from 'src/app/shared/_services/appointments/appointments.service';
import { ServicesService } from 'src/app/shared/_services/appointments/services.service';

interface Period {
    startsAt: Date;
    endsAt: Date;
}

@Injectable({
    providedIn: 'root',
})
export class AppointmentTimeService {
    readonly selectedTime$: BehaviorSubject<Date | null>;

    constructor(
        private dateService: DateService,
        private lengthService: LengthService,
        private cartService: AppointmentCartService,
        private appointmentsService: AppointmentsService,
        private servicesService: ServicesService
    ) {
        this.selectedTime$ = new BehaviorSubject<Date | null>(null);
    }

    getAvailableTimes(current: Date): Observable<Date[]> {
        return this.appointmentsService.getAppointments(current).pipe(
            map((appointments) => {
                return appointments.map((appointment) => {
                    const items = this.servicesService.mapAssociatedServicesToLengthItems(appointment.services);
                    const length = this.lengthService.calculateTotalLength(items);
                    return this.createPeriod(new Date(appointment.startsAt), length);
                });
            }),
            map((periods) => {
                const availableTimes: Date[] = [];
                const plannedLength = this.lengthService.calculateTotalLength(this.cartService.getLengthItems());
                let date = this.getStartDate(current);
                while (this.dateService.isWorkingTime(date, plannedLength)) {
                    const period = this.createPeriod(date, plannedLength);
                    if (!this.isOverlappingPeriod(period, periods)) {
                        availableTimes.push(new Date(date));
                    }
                    date.setMinutes(date.getMinutes() + 15);
                }
                return availableTimes;
            })
        );
    }

    private createPeriod(startsAt: Date, length: number): Period {
        return { startsAt: new Date(startsAt), endsAt: new Date(startsAt.getTime() + length * 60 * 1000) };
    }

    private getStartDate(date: Date): Date {
        if (this.dateService.isBeforeWorkingTime(date)) {
            return new Date(date.setHours(9, 0, 0, 0));
        }
        return this.roundToNextQuarter(date);
    }

    private roundToNextQuarter(date: Date): Date {
        const minutes = 15 * Math.ceil(date.getMinutes() / 15);
        return new Date(date.setMinutes(minutes, 0, 0));
    }

    private isOverlappingPeriod(period: Period, periods: Period[]): boolean {
        return (
            this.periodStartOverlaps(period, periods) ||
            this.periodEndOverlaps(period, periods) ||
            this.periodDurationOverlaps(period, periods)
        );
    }

    private periodStartOverlaps({ startsAt }: Period, periods: Period[]): boolean {
        return periods.some((period) => period.startsAt <= startsAt && startsAt < period.endsAt);
    }

    private periodEndOverlaps({ endsAt }: Period, periods: Period[]): boolean {
        return periods.some((period) => period.startsAt < endsAt && endsAt <= period.endsAt);
    }

    private periodDurationOverlaps({ startsAt, endsAt }: Period, periods: Period[]): boolean {
        return periods.some((period) => startsAt < period.startsAt && endsAt > period.endsAt);
    }
}
