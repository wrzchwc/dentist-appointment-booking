import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from '../../shared/_services/appointments/services.service';
import { AppointmentQuestion } from '../_services/appointment-questions/appointment-questions.service';
import { AppointmentTimeService } from '../_services/appointment-time/appointment-time.service';
import { AppointmentsService } from '../../shared/_services/appointments/appointments.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-appointment-booking',
    templateUrl: './appointment-booking.component.html',
    styleUrls: ['./appointment-booking.component.scss'],
})
export class AppointmentBookingComponent implements OnDestroy {
    readonly services: Service[];
    readonly questions: AppointmentQuestion[];
    private readonly onDestroy: Subject<void>;

    constructor(
        private route: ActivatedRoute,
        // eslint-disable-next-line no-unused-vars
        private time: AppointmentTimeService,
        private appointments: AppointmentsService,
        // eslint-disable-next-line no-unused-vars
        private router: Router
    ) {
        this.services = route.snapshot.data['services'];
        this.questions = route.snapshot.data['appointmentQuestions'];
        this.onDestroy = new Subject<void>();
        appointments
            .createAppointment()
            .pipe(takeUntil(this.onDestroy))
            .subscribe((appointment) => (appointments.currentAppointment = appointment));
    }

    ngOnDestroy(): void {
        this.time.selectedTime$.next(null);
        this.onDestroy.next();
        this.appointments.clear();
    }

    handleBookAppointmentClick(event: MouseEvent) {
        event.stopPropagation();
        this.appointments.confirmAppointment().subscribe(async () => {
            await this.router.navigateByUrl('/client');
        });
    }
}
