import { Component, Input, OnChanges } from '@angular/core';
import { Appointment } from '../../client/client-appointments/client-appointments.service';

@Component({
    selector: 'app-appointment-preview',
    templateUrl: './appointment-preview.component.html',
    styleUrls: ['./appointment-preview.component.scss'],
})
export class AppointmentPreviewComponent implements OnChanges {
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
