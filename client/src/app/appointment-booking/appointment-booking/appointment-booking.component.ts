import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppointmentDateService } from '../../shared/services/appointment-date.service';
import { AppointmentCartService } from '../appointment-cart.service';
import { debounceTime, map, Observable, Subject, takeUntil } from 'rxjs';
import { DateService } from '../../shared/services/date.service';
import { HealthStateService } from '../health-state/health-state.service';
import { AppointmentBookingService } from './appointment-booking.service';
import { LengthService } from '../../shared/services/length.service';
import { Service } from '../../shared/model';
import { AppointmentQuestion } from '../model';
import { MatStepperModule } from '@angular/material/stepper';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AppointmentServicesComponent } from '../appointment-services/appointment-services.component';
import { DateComponent } from '../date/date.component';
import { HealthStateComponent } from '../health-state/health-state.component';
import { SummaryComponent } from '../summary/summary.component';

@Component({
    selector: 'app-appointment-booking',
    templateUrl: './appointment-booking.component.html',
    styleUrls: ['./appointment-booking.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatStepperModule,
        AsyncPipe,
        MatButtonModule,
        RouterLink,
        AppointmentServicesComponent,
        DateComponent,
        HealthStateComponent,
        SummaryComponent,
    ],
    standalone: true,
})
export class AppointmentBookingComponent implements OnInit, OnDestroy {
    readonly services: Service[] = this.route.snapshot.data['services'];
    readonly questions: AppointmentQuestion[] = this.route.snapshot.data['appointmentQuestions'];

    availableTimes: Date[] = [];

    private readonly destroy$: Subject<void> = new Subject();

    constructor(
        private readonly time: AppointmentDateService,
        private readonly router: Router,
        private readonly booking: AppointmentBookingService,
        private readonly route: ActivatedRoute,
        private readonly cart: AppointmentCartService,
        private readonly date: DateService,
        private readonly healthState: HealthStateService,
        private readonly length: LengthService
    ) {}

    get isCartValid(): boolean {
        return this.cart.valid;
    }

    get selectedDate$(): Observable<Date | null> {
        return this.time.selectedDate$;
    }

    ngOnInit(): void {
        this.cart.initialize(this.route.snapshot.data['services']);
        this.cart.change$.pipe(takeUntil(this.destroy$), debounceTime(281.25)).subscribe(() => {
            this.refreshAppointmentsAvailability();
        });
    }

    ngOnDestroy(): void {
        this.time.selectedDate$.next(null);
        this.destroy$.next();
        this.destroy$.complete();
        this.date.reset();
        this.healthState.clear();
    }

    refreshAppointmentsAvailability(): void {
        this.time
            .getAvailableDates(this.date.currentWorkday, this.length.calculateTotalLength(this.cart.lengthItems))
            .pipe(
                takeUntil(this.destroy$),
                map((times) => times.filter((time) => new Date(time) >= this.date.currentWorkday))
            )
            .subscribe((availableTimes) => {
                this.availableTimes = availableTimes;
            });
    }

    async handleBookAppointmentClick(event: MouseEvent): Promise<void> {
        event.stopPropagation();
        const startsAt = this.time.selectedDate$.value;
        if (startsAt !== null) {
            this.booking
                .createAppointment(startsAt, this.cart.quantities, this.healthState.infos)
                .pipe(takeUntil(this.destroy$))
                .subscribe(async () => {
                    await this.router.navigateByUrl('/client');
                });
        }
    }
}
