import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { DateService } from '../_services/utility/date.service';

@Component({
    selector: 'app-appointment',
    templateUrl: './appointment.component.html',
    styleUrls: ['./appointment.component.scss'],
})
export class AppointmentComponent implements OnChanges {
    @Input() appointmentId?: string;
    @Input() startsAt?: Date;
    @Output() readonly cancel: EventEmitter<void>;
    @Output() readonly reschedule: EventEmitter<void>;
    cancelable?: boolean;

    // eslint-disable-next-line no-unused-vars
    constructor(private date: DateService) {
        this.cancel = new EventEmitter<void>();
        this.reschedule = new EventEmitter<void>();
    }

    ngOnChanges(): void {
        if (this.startsAt) {
            this.cancelable = this.date.currentDay < new Date(this.startsAt);
        }
    }
}
