/*eslint no-unused-vars: 0*/
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from '../../shared/_services/appointments/services.service';
import { AppointmentQuestion } from '../_services/appointment-questions/appointment-questions.service';
import { AppointmentTimeService } from '../_services/appointment-time/appointment-time.service';
import { AppointmentCartService } from '../_services/appointment-cart/appointment-cart.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { AppointmentsService } from '../../shared/_services/appointments/appointments.service';
import { DateService } from '../../shared/_services/date.service';
import { HealthStateService } from '../health-state/health-state.service';

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
        public time: AppointmentTimeService,
        private router: Router,
        private appointments: AppointmentsService,
        private route: ActivatedRoute,
        public cart: AppointmentCartService,
        private date: DateService,
        private healthState: HealthStateService
    ) {
        this.services = route.snapshot.data['services'];
        this.questions = route.snapshot.data['appointmentQuestions'];
        cart.initialize(route.snapshot.data['services']);
        this.availableTimes = [];
        this.onDestroy = new Subject<void>();
        cart.change$.pipe(takeUntil(this.onDestroy), debounceTime(281.25)).subscribe(() => {
            this.refreshAppointments();
        });
    }

    ngOnDestroy(): void {
        this.time.selectedTime$.next(null);
        this.onDestroy.next();
        this.date.reset();
        this.healthState.clear();
    }

    refreshAppointments() {
        this.time
            .getAvailableTimes()
            .pipe(takeUntil(this.onDestroy))
            .subscribe((times) => {
                this.availableTimes = times;
            });
    }

    async handleBookAppointmentClick(event: MouseEvent) {
        event.stopPropagation();
        const startsAt = this.time.selectedTime$.value;
        if (startsAt !== null) {
            this.appointments
                .createAppointment(startsAt, this.cart.getIdQuantityObjects())
                .pipe(takeUntil(this.onDestroy))
                .subscribe(async () => {
                    await this.router.navigateByUrl('/client');
                });
        }
    }
}
