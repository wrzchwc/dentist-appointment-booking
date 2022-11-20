import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-client-appointments',
    templateUrl: './client-appointments.component.html',
    styleUrls: ['./client-appointments.component.scss'],
})
export class ClientAppointmentsComponent {
    // eslint-disable-next-line no-unused-vars
    constructor(public route: ActivatedRoute) {}
}
