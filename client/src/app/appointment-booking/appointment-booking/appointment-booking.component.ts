/*eslint no-unused-vars: 0*/
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentDateService } from '../../shared/_services/appointment-date.service';
import { AppointmentCartService } from '../appointment-cart.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { DateService } from '../../shared/_services/utility/date.service';
import { HealthStateService } from '../health-state/health-state.service';
import { AppointmentBookingService, AppointmentQuestion } from './appointment-booking.service';
import { LengthService } from '../../shared/_services/utility/length.service';
import { Service } from '../../shared/shared.model';

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
        public time: AppointmentDateService,
        private router: Router,
        private booking: AppointmentBookingService,
        private route: ActivatedRoute,
        public cart: AppointmentCartService,
        private date: DateService,
        private healthState: HealthStateService,
        private length: LengthService
    ) {
        this.services = route.snapshot.data['services'];
        this.questions = route.snapshot.data['appointmentQuestions'];
        cart.initialize(route.snapshot.data['services']);
        this.availableTimes = [];
        this.onDestroy = new Subject<void>();
        cart.change$.pipe(takeUntil(this.onDestroy), debounceTime(281.25)).subscribe(() => {
            this.refreshAppointmentsAvailability();
        });
    }

    ngOnDestroy(): void {
        this.time.selectedDate$.next(null);
        this.onDestroy.next();
        this.date.reset();
        this.healthState.clear();
    }

    refreshAppointmentsAvailability() {
        this.time
            .getAvailableDates(this.date.currentWorkday, this.length.calculateTotalLength(this.cart.getLengthItems()))
            .pipe(takeUntil(this.onDestroy))
            .subscribe((times) => {
                this.availableTimes = times.filter((time) => new Date(time) >= this.date.currentWorkday);
            });
    }

    async handleBookAppointmentClick(event: MouseEvent) {
        event.stopPropagation();
        const startsAt = this.time.selectedDate$.value;
        if (startsAt !== null) {
            this.booking
                .createAppointment(startsAt, this.cart.getIdQuantityObjects(), this.healthState.getIdInfoItems())
                .pipe(takeUntil(this.onDestroy))
                .subscribe(async () => {
                    await this.router.navigateByUrl('/client');
                });
        }
    }
}
