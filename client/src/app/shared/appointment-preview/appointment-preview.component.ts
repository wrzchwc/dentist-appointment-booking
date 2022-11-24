import { Component, Input, OnChanges } from '@angular/core';
import { Appointment } from '../appointments/appointments.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-appointment-preview',
    templateUrl: './appointment-preview.component.html',
    styleUrls: ['./appointment-preview.component.scss'],
})
export class AppointmentPreviewComponent implements OnChanges {
    @Input() appointment?: Appointment;
    services: string[];
    link: string;

    // eslint-disable-next-line no-unused-vars
    constructor(private router: Router) {
        this.services = [];
        this.link = '';
    }

    ngOnChanges(): void {
        if (this.appointment !== undefined) {
            this.services = this.appointment.services.map((service) => service.name);
            const [role] = this.router.url.split('/').filter(Boolean);
            this.link = `/${role}/appointments/${this.appointment.id}`;
        }
    }
}
