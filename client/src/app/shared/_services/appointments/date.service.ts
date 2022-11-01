import { Injectable } from '@angular/core';

type DayOffset = 3 | 1;

@Injectable({
    providedIn: 'root',
})
export class DateService {
    constructor() {}

    getCurrentDate() {
        return new Date();
    }

    getPreviousWorkday(current: Date): Date {
        const date = new Date(current);
        const offset = this.getPreviousOffset(current.getDay());
        date.setDate(current.getDate() - offset);
        return date;
    }

    getNextWorkday(current: Date): Date {
        const date = new Date(current);
        const offset = this.getNextOffset(current.getDay());
        date.setDate(current.getDate() + offset);
        return date;
    }

    private getPreviousOffset(day: number): DayOffset {
        const MONDAY = 1;
        return day === MONDAY ? 3 : 1;
    }

    private getNextOffset(day: number): DayOffset {
        const FRIDAY = 5;
        return day === FRIDAY ? 3 : 1;
    }
}
