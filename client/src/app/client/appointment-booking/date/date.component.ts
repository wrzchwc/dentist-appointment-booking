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
    availableTimes: Date[];

    constructor(public date: DateService, private time: AppointmentTimeService) {
        this.current = date.getCurrentDate();
        this.next = date.getNextWorkday(this.current);
        this.previous = date.getPreviousWorkday(this.current);
        this.availableTimes = time.getAvailableTimes(this.current);
    }

    handlePreviousDate() {
        this.current = this.date.getPreviousWorkday(this.current);
        this.previous = this.date.getPreviousWorkday(this.previous);
        this.next = this.date.getPreviousWorkday(this.next);
    }

    handleNextDate() {
        this.current = this.date.getNextWorkday(this.current);
        this.previous = this.date.getNextWorkday(this.previous);
        this.next = this.date.getNextWorkday(this.next);
    }

    handleClick() {
        this.time.selectedTime$.next(null);
    }

    ignoreClick(event: Event) {
        event.stopPropagation();
    }
}
