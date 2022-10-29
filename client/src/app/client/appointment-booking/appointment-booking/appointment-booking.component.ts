import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Service } from '../../../shared/_services/appointments/services.service';
import { AppointmentQuestion } from '../_services/appointment-questions/appoint-questions.service';

@Component({
    selector: 'app-appointment-booking',
    templateUrl: './appointment-booking.component.html',
    styleUrls: ['./appointment-booking.component.scss'],
})
export class AppointmentBookingComponent {
    services: Service[];
    questions: AppointmentQuestion[];

    constructor(private route: ActivatedRoute) {
        this.services = route.snapshot.data['services'];
        this.questions = route.snapshot.data['appointmentQuestions'];
    }
}
