import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AppointmentTimeService {
    readonly selectedTime$: BehaviorSubject<Date | null>;

    constructor() {
        this.selectedTime$ = new BehaviorSubject<Date | null>(null);
    }

    getAvailableTimes(date: Date): Date[] {
        const startDate = new Date(date);
        startDate.setUTCHours(7, 0, 0, 0);
        const availableTimes = Array.of<Date>(new Date(startDate));

        while (startDate.getUTCHours() < 15) {
            availableTimes.push(new Date(startDate.setMinutes(startDate.getUTCMinutes() + 15)));
        }

        return availableTimes;
    }
}
