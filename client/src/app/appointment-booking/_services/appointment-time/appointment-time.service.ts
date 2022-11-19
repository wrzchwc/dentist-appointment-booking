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
        const availableTimes: Date[] = [];
        const plannedLength = this.lengthService.calculateTotalLength(this.cartService.getLengthItems());
        const startDate = this.getStartDate(current);

        return this.appointmentsService.getAppointments(current).pipe(
            map((appointments) => {
                return appointments.map((appointment) => {
                    const startsAt = new Date(appointment.startsAt);
                    const items = this.servicesService.mapAssociatedServicesToLengthItems(appointment.services);
                    const length = this.lengthService.calculateTotalLength(items) * 60 * 1000;
                    return { startsAt, endsAt: new Date(startsAt.getTime() + length) };
                }) as Period[];
            }),
            map(() => {
                let date = startDate;
                while (this.dateService.isWorkingTime(date, plannedLength)) {
                    availableTimes.push(new Date(date));
                    date.setMinutes(date.getMinutes() + 15);
                }
                return availableTimes;
            })
        );
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
}
