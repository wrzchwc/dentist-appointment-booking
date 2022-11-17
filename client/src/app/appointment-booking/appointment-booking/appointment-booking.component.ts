import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from '../../shared/_services/appointments/services.service';
import { AppointmentQuestion } from '../_services/appointment-questions/appointment-questions.service';
import { AppointmentTimeService } from '../_services/appointment-time/appointment-time.service';
import { AppointmentCartService } from '../_services/appointment-cart/appointment-cart.service';

@Component({
    selector: 'app-appointment-booking',
    templateUrl: './appointment-booking.component.html',
    styleUrls: ['./appointment-booking.component.scss'],
})
export class AppointmentBookingComponent implements OnDestroy {
    readonly services: Service[];
    readonly questions: AppointmentQuestion[];

    constructor(
        // eslint-disable-next-line no-unused-vars
        private time: AppointmentTimeService,
        // eslint-disable-next-line no-unused-vars
        private router: Router,
        private route: ActivatedRoute,
        private cart: AppointmentCartService
    ) {
        this.services = route.snapshot.data['services'];
        this.questions = route.snapshot.data['appointmentQuestions'];
        cart.initialize(route.snapshot.data['services']);
    }

    ngOnDestroy(): void {
        this.time.selectedTime$.next(null);
    }

    async handleBookAppointmentClick(event: MouseEvent) {
        event.stopPropagation();
        await this.router.navigateByUrl('/client');
    }
}
