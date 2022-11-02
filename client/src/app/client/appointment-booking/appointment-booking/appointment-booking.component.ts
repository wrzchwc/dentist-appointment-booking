import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Service } from '../../../shared/_services/appointments/services.service';
import { AppointmentQuestion } from '../_services/appointment-questions/appoint-questions.service';
import { AppointmentTimeService } from '../_services/appointment-time/appointment-time.service';

@Component({
    selector: 'app-appointment-booking',
    templateUrl: './appointment-booking.component.html',
    styleUrls: ['./appointment-booking.component.scss'],
})
export class AppointmentBookingComponent implements OnDestroy {
    readonly services: Service[];
    readonly questions: AppointmentQuestion[];

    // eslint-disable-next-line no-unused-vars
    constructor(private route: ActivatedRoute, private time: AppointmentTimeService) {
        this.services = route.snapshot.data['services'];
        this.questions = route.snapshot.data['appointmentQuestions'];
    }

    ngOnDestroy(): void {
        this.time.selectedTime$.next(null);
    }
}
