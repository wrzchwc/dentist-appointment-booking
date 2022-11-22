import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Appointment } from '../client-appointments/client-appointments.service';

@Component({
    selector: 'app-client-appointment',
    templateUrl: './client-appointment.component.html',
    styleUrls: ['./client-appointment.component.scss'],
})
export class ClientAppointmentComponent {
    appointment?: Appointment;

    constructor(private route: ActivatedRoute) {
        this.appointment = route.snapshot.data['appointment'];
    }
}
