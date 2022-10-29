import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Service } from '../../../shared/_services/appointments/services.service';

@Component({
    selector: 'app-appointment-booking',
    templateUrl: './appointment-booking.component.html',
    styleUrls: ['./appointment-booking.component.scss'],
})
export class AppointmentBookingComponent {
    services: Service[];

    constructor(private route: ActivatedRoute) {
        this.services = route.snapshot.data['services'];
    }
}
