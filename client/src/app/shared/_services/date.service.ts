/*eslint no-unused-vars: 0*/
import { Injectable } from '@angular/core';
import { WeekDay } from '@angular/common';

type DaysToWorkday = 3 | 1;

@Injectable({
    providedIn: 'root',
})
export class DateService {
    constructor() {}

    getCurrentWorkdayDate(): Date {
        const date = this.getCurrentDate();
        if (this.isDay(WeekDay.Saturday, date)) {
            date.setDate(date.getDate() + 2);
            return new Date(date.setHours(9, 0, 0, 0));
        } else if (this.isDay(WeekDay.Sunday, date) || this.isAfterWorkingTime(date)) {
            return this.getNextWorkday(date);
        } else if (this.isBeforeWorkingTime(date)) {
            date.setHours(9, 0, 0, 0);
            return date;
        }
        return date;
    }

    getCurrentDate() {
        return new Date();
    }

    isWorkingTime(date: Date, plannedAppointmentLength = 0) {
        return date.getHours() >= 9 && this.toMinutes(date) <= 17 * 60 - plannedAppointmentLength;
    }

    // return number of minutes since 12 AM on given day
    private toMinutes(date: Date): number {
        return 60 * date.getHours() + date.getMinutes();
    }

    getNextWorkday(date: Date): Date {
        const nextWeekday = new Date(new Date(date).setDate(date.getDate() + this.daysToNextWorkday(date)));
        return new Date(nextWeekday.setHours(9, 0, 0, 0));
    }

    private daysToNextWorkday(date: Date): DaysToWorkday {
        return this.isDay(WeekDay.Friday, date) ? 3 : 1;
    }

    getPreviousWorkday(date: Date): Date {
        const copy = new Date(date);
        const offsetReversed = new Date(copy.setDate(copy.getDate() - this.daysToPreviousWorkday(date)));
        const current = this.getCurrentWorkdayDate();
        return offsetReversed.getDate() === current.getDate() ? current : offsetReversed;
    }

    private daysToPreviousWorkday(date: Date): DaysToWorkday {
        return this.isDay(WeekDay.Monday, date) ? 3 : 1;
    }

    private isDay(day: WeekDay, date: Date): boolean {
        return date.getDay() === day;
    }

    isBeforeWorkingTime(date: Date): boolean {
        return date.getHours() < 9;
    }

    private isAfterWorkingTime(date: Date): boolean {
        return date.getHours() > 17;
    }
}
