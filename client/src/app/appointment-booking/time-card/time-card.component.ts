import { Component, Input } from '@angular/core';
import { AppointmentDateService } from '../appointment-booking/appointment-date.service';

@Component({
    selector: 'app-time-card',
    templateUrl: './time-card.component.html',
    styleUrls: ['./time-card.component.scss'],
})
export class TimeCardComponent {
    @Input() date?: Date;

    // eslint-disable-next-line no-unused-vars
    constructor(public time: AppointmentDateService) {}

    handleClick($event: Event) {
        $event.stopPropagation();
        const selection: Date | null = this.time.selectedDate$.value === this.date ? null : this.date!;
        this.time.selectedDate$.next(selection);
    }
}
