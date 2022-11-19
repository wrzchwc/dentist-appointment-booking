import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from '../../shared/_services/appointments/services.service';
import { AppointmentQuestion } from '../_services/appointment-questions/appointment-questions.service';
import { AppointmentTimeService } from '../_services/appointment-time/appointment-time.service';
import { AppointmentCartService } from '../_services/appointment-cart/appointment-cart.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-appointment-booking',
    templateUrl: './appointment-booking.component.html',
    styleUrls: ['./appointment-booking.component.scss'],
})
export class AppointmentBookingComponent implements OnDestroy {
    availableTimes: Date[];
    readonly services: Service[];
    readonly questions: AppointmentQuestion[];
    private readonly onDestroy: Subject<void>;

    constructor(
        // eslint-disable-next-line no-unused-vars
        public time: AppointmentTimeService,
        // eslint-disable-next-line no-unused-vars
        private router: Router,
        private route: ActivatedRoute,
        public cart: AppointmentCartService
    ) {
        this.services = route.snapshot.data['services'];
        this.questions = route.snapshot.data['appointmentQuestions'];
        cart.initialize(route.snapshot.data['services']);
        this.availableTimes = [];
        this.onDestroy = new Subject<void>();
        cart.change$.pipe(takeUntil(this.onDestroy)).subscribe(() => {
            this.refreshAppointments();
        });
    }

    refreshAppointments() {
        this.time
            .getAvailableTimes()
            .pipe(takeUntil(this.onDestroy))
            .subscribe((times) => {
                this.availableTimes = times;
            });
    }

    ngOnDestroy(): void {
        this.time.selectedTime$.next(null);
        this.onDestroy.next();
    }

    async handleBookAppointmentClick(event: MouseEvent) {
        event.stopPropagation();
        await this.router.navigateByUrl('/client');
    }
}
