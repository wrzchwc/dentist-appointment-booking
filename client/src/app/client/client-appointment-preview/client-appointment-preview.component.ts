import { Component, Input, OnChanges } from '@angular/core';
import { Appointment } from '../../appointment-booking/appointment-booking/appointment-booking.service';

@Component({
    selector: 'app-client-appointment-preview',
    templateUrl: './client-appointment-preview.component.html',
    styleUrls: ['./client-appointment-preview.component.scss'],
})
export class ClientAppointmentPreviewComponent implements OnChanges {
    @Input() appointment?: Appointment;
    services: string[];
    link: string;

    constructor() {
        this.services = [];
        this.link = '';
    }

    ngOnChanges(): void {
        if (this.appointment !== undefined) {
            this.services = this.appointment.services.map((service) => service.name);
            this.link = `/client/appointments/${this.appointment.id}`;
        }
    }
}
