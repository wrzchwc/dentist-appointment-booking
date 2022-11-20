import { Component, Input } from '@angular/core';
import { AppointmentTimeService } from '../appointment-booking/appointment-time.service';

@Component({
    selector: 'app-time-card',
    templateUrl: './time-card.component.html',
    styleUrls: ['./time-card.component.scss'],
})
export class TimeCardComponent {
    @Input() date?: Date;

    // eslint-disable-next-line no-unused-vars
    constructor(public time: AppointmentTimeService) {}

    handleClick($event: Event) {
        $event.stopPropagation();
        const selection: Date | null = this.time.selectedTime$.value === this.date ? null : this.date!;
        this.time.selectedTime$.next(selection);
    }
}
