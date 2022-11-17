import { Component } from '@angular/core';
import { DateService } from 'src/app/shared/_services/appointments/date.service';
import { AppointmentTimeService } from '../_services/appointment-time/appointment-time.service';

@Component({
    selector: 'app-date',
    templateUrl: './date.component.html',
    styleUrls: ['./date.component.scss'],
})
export class DateComponent {
    current: Date;
    next: Date;
    previous: Date;
    availableTimes?: Date[];

    // eslint-disable-next-line no-unused-vars
    constructor(public date: DateService, private time: AppointmentTimeService) {
        this.current = date.getCurrentWorkdayDate();
        this.next = date.getNextWorkday(this.current);
        this.previous = date.getPreviousWorkday(this.current);
        this.availableTimes = this.time.getAvailableTimes(this.current);
    }

    handlePreviousDate() {
        this.current = this.date.getPreviousWorkday(this.current);
        [this.previous, this.next, this.availableTimes] = this.handleDateChange(this.current);
    }

    handleNextDate() {
        this.current = this.date.getNextWorkday(this.current);
        [this.previous, this.next, this.availableTimes] = this.handleDateChange(this.current);
    }

    private handleDateChange(current: Date): [Date, Date, Date[]] {
        return [
            this.date.getPreviousWorkday(current),
            this.date.getNextWorkday(current),
            this.time.getAvailableTimes(current),
        ];
    }

    handleClick() {
        this.time.selectedTime$.next(null);
    }

    ignoreClick(event: Event) {
        event.stopPropagation();
    }
}
