/*eslint no-unused-vars: 0*/
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { DateService } from 'src/app/shared/_services/utility/date.service';
import { LengthItem, LengthService } from 'src/app/shared/_services/utility/length.service';
import { AppointmentCartService } from '../appointment-cart.service';
import { ServicesService } from 'src/app/shared/_services/services.service';
import { AppointmentBookingService } from './appointment-booking.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface Period {
    startsAt: Date;
    endsAt: Date;
}

@Injectable({
    providedIn: 'root',
})
export class AppointmentTimeService {
    readonly selectedTime$: BehaviorSubject<Date | null>;
    private readonly baseUrl: string;

    constructor(
        private dateService: DateService,
        private lengthService: LengthService,
        private cartService: AppointmentCartService,
        private appointmentBookingService: AppointmentBookingService,
        private servicesService: ServicesService,
        private httpClient: HttpClient
    ) {
        this.selectedTime$ = new BehaviorSubject<Date | null>(null);
        this.baseUrl = `${environment.apiUrl}/api/appointments/available-times`;
    }

    getAvailableTimes(): Observable<Date[]> {
        return this.appointmentBookingService.getAppointments(this.dateService.currentWorkday).pipe(
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
                let date = this.getStartDate(this.dateService.currentWorkday);
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

    getAvailableDates(at: Date): Observable<Date[]> {
        return this.httpClient.get<AvailableTime[]>(this.baseUrl, { params: { at: at.toISOString() } }).pipe(
            map((times) => {
                return times.map(({ services, startsAt }) => {
                    const items = services.map(this.mapAssociatedServiceToLengthItem);
                    return this.createPeriod(new Date(startsAt), this.lengthService.calculateTotalLength(items));
                });
            }),
            map((periods) => {
                const availableTimes: Date[] = [];
                const plannedLength = this.lengthService.calculateTotalLength(this.cartService.getLengthItems());
                let date = this.getStartDate(this.dateService.currentWorkday);
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

    private mapAssociatedServiceToLengthItem(service: AssociatedService): LengthItem {
        return { quantity: service.appointmentServices.quantity, length: service.length };
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

interface AvailableTime {
    startsAt: Date;
    services: AssociatedService[];
}

interface AssociatedService {
    length: number;
    appointmentServices: {
        quantity: number;
    };
}
