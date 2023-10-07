import { Injectable } from '@angular/core';
import { WeekDay } from '@angular/common';
import { DateObjectUnits, DateTime } from 'luxon';

@Injectable({
    providedIn: 'root',
})
export class DateService {
    private readonly START: DateObjectUnits = {hour: 9, minute: 0, second: 0, millisecond: 0};

    private _currentWorkday: DateTime = this.getCurrentWorkdayDate();
    private _previousWorkday: DateTime = this.calculatePreviousWorkday(this._currentWorkday);
    private _nextWorkday: DateTime = this.calculateNextWorkday(this._currentWorkday);

    get currentWorkday(): Date {
        return this._currentWorkday.toJSDate();
    }

    get previousWorkday(): Date {
        return this._previousWorkday.toJSDate();
    }

    get nextWorkday(): Date {
        return this._nextWorkday.toJSDate();
    }

    get currentDay(): Date {
        return new Date();
    }

    workdayForward(): void {
        this._currentWorkday = this.calculateNextWorkday(this._currentWorkday);
        this._nextWorkday = this.calculateNextWorkday(this._nextWorkday);
        this._previousWorkday = this.calculateNextWorkday(this._previousWorkday);
    }

    workdayBackward(): void {
        this._currentWorkday = this.calculatePreviousWorkday(this._currentWorkday);
        this._previousWorkday = this.calculatePreviousWorkday(this._previousWorkday);
        this._nextWorkday = this.calculatePreviousWorkday(this._nextWorkday);
    }

    reset(): void {
        this._currentWorkday = this.getCurrentWorkdayDate();
        this._previousWorkday = this.calculatePreviousWorkday(this._currentWorkday);
        this._nextWorkday = this.calculateNextWorkday(this._currentWorkday);
    }

    private getCurrentWorkdayDate(): DateTime {
        const dateTime: DateTime = DateTime.fromJSDate(new Date());

        if (this.isDay(WeekDay.Saturday, dateTime)) {
            return dateTime.plus({day: 2}).set(this.START);
        } else if (this.isDay(WeekDay.Sunday, dateTime) || dateTime.hour > 17) {
            return this.calculateNextWorkday(dateTime);
        } else if (dateTime.hour < 9) {
            return dateTime.set(this.START);
        }
        return dateTime;
    }

    private calculateNextWorkday(dateTime: DateTime): DateTime {
        return dateTime.plus({ day: this.isDay(WeekDay.Friday, dateTime) ? 3 : 1 }).set(this.START);
    }

    private calculatePreviousWorkday(dateTime: DateTime): DateTime {
        const offsetReversed = dateTime.minus({ day: this.isDay(WeekDay.Monday, dateTime) ? 3 : 1 });
        const current = this.getCurrentWorkdayDate();

        return offsetReversed.day === current.day ? current :offsetReversed;
    }

    private isDay(day: WeekDay, dateTime: DateTime): boolean {
        return dateTime.day === day;
    }
}
