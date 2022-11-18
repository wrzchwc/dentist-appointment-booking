/*eslint no-unused-vars: 0*/
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DateService } from 'src/app/shared/_services/date.service';
import { LengthService } from 'src/app/shared/_services/appointments/length.service';
import { AppointmentCartService } from '../appointment-cart/appointment-cart.service';

@Injectable({
    providedIn: 'root',
})
export class AppointmentTimeService {
    readonly selectedTime$: BehaviorSubject<Date | null>;

    constructor(
        private dateService: DateService,
        private lengthService: LengthService,
        private cartService: AppointmentCartService
    ) {
        this.selectedTime$ = new BehaviorSubject<Date | null>(null);
    }

    getAvailableTimes(current: Date): Date[] {
        const availableTimes: Date[] = [];
        const plannedLength = this.lengthService.calculateTotalLength(this.cartService.getServiceItems());
        const startDate = this.getStartDate(current);
        for (let d = startDate; this.dateService.isWorkingTime(d, plannedLength); d.setMinutes(d.getMinutes() + 15)) {
            availableTimes.push(new Date(d));
        }

        return availableTimes;
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
