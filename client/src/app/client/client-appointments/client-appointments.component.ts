import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Appointment } from '../../appointment-booking/appointment-booking/appointment-booking.service';

@Component({
    selector: 'app-client-appointments',
    templateUrl: './client-appointments.component.html',
    styleUrls: ['./client-appointments.component.scss'],
})
export class ClientAppointmentsComponent {
    appointments: Appointment[];

    constructor(private route: ActivatedRoute) {
        this.appointments = route.snapshot.data['appointments'];
    }
}
