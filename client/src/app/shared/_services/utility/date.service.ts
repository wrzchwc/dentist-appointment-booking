/*eslint no-unused-vars: 0*/
import { Injectable } from '@angular/core';
import { WeekDay } from '@angular/common';

type DaysToWorkday = 3 | 1;

@Injectable({
    providedIn: 'root',
})
export class DateService {
    private _currentWorkday: Date;
    private _previousWorkday: Date;
    private _nextWorkday: Date;

    constructor() {
        this._currentWorkday = this.getCurrentWorkdayDate();
        this._previousWorkday = this.calculatePreviousWorkday(this._currentWorkday);
        this._nextWorkday = this.calculateNextWorkday(this._currentWorkday);
    }

    private getCurrentWorkdayDate(): Date {
        const date = this.currentDay;
        if (this.isDay(WeekDay.Saturday, date)) {
            date.setDate(date.getDate() + 2);
            return new Date(date.setHours(9, 0, 0, 0));
        } else if (this.isDay(WeekDay.Sunday, date) || this.isAfterWorkingTime(date)) {
            return this.calculateNextWorkday(date);
        } else if (this.isBeforeWorkingTime(date)) {
            date.setHours(9, 0, 0, 0);
            return date;
        }
        return date;
    }

    isAfterWorkingTime(date: Date): boolean {
        return date.getHours() > 17;
    }

    get currentWorkday(): Date {
        return this._currentWorkday;
    }

    get previousWorkday(): Date {
        return this._previousWorkday;
    }

    get nextWorkday(): Date {
        return this._nextWorkday;
    }

    get currentDay(): Date {
        return new Date();
    }

    isWorkingTime(date: Date, plannedAppointmentLength = 0) {
        return date.getHours() >= 9 && this.toMinutes(date) <= 17 * 60 - plannedAppointmentLength;
    }

    // return number of minutes since 12 AM on given day
    private toMinutes(date: Date): number {
        return 60 * date.getHours() + date.getMinutes();
    }

    workdayForward(): void {
        this._currentWorkday = this.calculateNextWorkday(this._currentWorkday);
        this._nextWorkday = this.calculateNextWorkday(this._nextWorkday);
        this._previousWorkday = this.calculateNextWorkday(this._previousWorkday);
    }

    private calculateNextWorkday(date: Date): Date {
        const nextWeekday = new Date(new Date(date).setDate(date.getDate() + this.daysToNextWorkday(date)));
        return new Date(nextWeekday.setHours(9, 0, 0, 0));
    }

    private daysToNextWorkday(date: Date): DaysToWorkday {
        return this.isDay(WeekDay.Friday, date) ? 3 : 1;
    }

    workdayBackward(): void {
        this._currentWorkday = this.calculatePreviousWorkday(this._currentWorkday);
        this._previousWorkday = this.calculatePreviousWorkday(this._previousWorkday);
        this._nextWorkday = this.calculatePreviousWorkday(this._nextWorkday);
    }

    private calculatePreviousWorkday(date: Date): Date {
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

    reset() {
        this._currentWorkday = this.getCurrentWorkdayDate();
        this._previousWorkday = this.calculatePreviousWorkday(this._currentWorkday);
        this._nextWorkday = this.calculateNextWorkday(this._currentWorkday);
    }
}
