import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DateService } from '../../../shared/_services/date.service';

@Injectable({
    providedIn: 'root',
})
export class AppointmentTimeService {
    readonly selectedTime$: BehaviorSubject<Date | null>;

    // eslint-disable-next-line no-unused-vars
    constructor(private dateService: DateService) {
        this.selectedTime$ = new BehaviorSubject<Date | null>(null);
    }

    getAvailableTimes(current: Date): Date[] {
        const availableTimes: Date[] = [];
        for (let d = this.getStartDate(current); this.dateService.isWorkingTime(d); d.setMinutes(d.getMinutes() + 15)) {
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
