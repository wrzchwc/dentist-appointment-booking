/*eslint no-unused-vars: 0*/
import { Injectable } from '@angular/core';
import { WeekDay } from '@angular/common';

const ONE_DAY_IN_MILLISECONDS = 86_400_000;

@Injectable({
    providedIn: 'root',
})
export class DateService {
    constructor() {}

    getCurrentWorkdayDate() {
        const date = this.getCurrentDate();
        return this.isWorkingTime(date) ? date : this.getNextWorkday(date);
    }

    getCurrentDate() {
        return new Date();
    }

    private isWorkingTime(date: Date) {
        return date.getHours() < 17;
    }

    getNextWorkday(date: Date): Date {
        const offset = (this.isDay(WeekDay.Friday, date) ? 3 : 1) * ONE_DAY_IN_MILLISECONDS;
        return new Date(date.getTime() + offset);
    }

    getPreviousWorkday(date: Date): Date {
        const offset = (this.isDay(WeekDay.Monday, date) ? 3 : 1) * ONE_DAY_IN_MILLISECONDS;
        return new Date(date.getTime() - offset);
    }

    private isDay(day: WeekDay, date: Date): boolean {
        return date.getDay() === day;
    }
}
