import { Component, OnDestroy } from '@angular/core';
import { AdminAppointmentsService, Appointment } from './admin-appointments.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-admin-appointments',
    templateUrl: './admin-appointments.component.html',
    styleUrls: ['./admin-appointments.component.scss'],
})
export class AdminAppointmentsComponent implements OnDestroy {
    appointments: Appointment[];
    private readonly onDestroy: Subject<void>;

    // eslint-disable-next-line no-unused-vars
    constructor(private route: ActivatedRoute, private service: AdminAppointmentsService) {
        this.appointments = route.snapshot.data['appointments'];
        this.onDestroy = new Subject<void>();
    }

    ngOnDestroy(): void {
        this.onDestroy.next();
    }

    handleDateChange(date: Date) {
        this.service
            .getAppointments(date)
            .pipe(takeUntil(this.onDestroy))
            .subscribe((appointments) => {
                this.appointments = appointments;
            });
    }
}
