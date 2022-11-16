/*eslint no-unused-vars: 0*/
import { Injectable } from '@angular/core';

const ONE_DAY_IN_MILLISECONDS = 86_400_000;

enum Weekday {
    MONDAY = 1,
    FRIDAY = 5,
}

@Injectable({
    providedIn: 'root',
})
export class DateService {
    constructor() {}

    getCurrentDate() {
        return new Date();
    }

    getPreviousWorkday(date: Date): Date {
        const offset = date.getDay() === Weekday.MONDAY ? 3 * ONE_DAY_IN_MILLISECONDS : ONE_DAY_IN_MILLISECONDS;
        return new Date(date.getTime() - offset);
    }

    getNextWorkday(date: Date): Date {
        const offset = date.getDay() === Weekday.FRIDAY ? 3 * ONE_DAY_IN_MILLISECONDS : ONE_DAY_IN_MILLISECONDS;
        return new Date(date.getTime() + offset);
    }
}
