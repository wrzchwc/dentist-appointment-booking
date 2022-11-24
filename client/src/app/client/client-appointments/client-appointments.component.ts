import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Appointment, ClientAppointmentsService } from './client-appointments.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-client-appointments',
    templateUrl: './client-appointments.component.html',
    styleUrls: ['./client-appointments.component.scss'],
})
export class ClientAppointmentsComponent implements OnDestroy {
    appointments: Appointment[];
    private readonly onDestroy: Subject<void>;

    // eslint-disable-next-line no-unused-vars
    constructor(private clientAppointments: ClientAppointmentsService, private route: ActivatedRoute) {
        this.appointments = route.snapshot.data['appointments'];
        this.onDestroy = new Subject<void>();
    }

    ngOnDestroy() {
        this.onDestroy.next();
    }

    handleDateChange(date: Date) {
        this.clientAppointments
            .getAppointments(date)
            .pipe(takeUntil(this.onDestroy))
            .subscribe((appointments) => {
                this.appointments = appointments;
            });
    }
}
