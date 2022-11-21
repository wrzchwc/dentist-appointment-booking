import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Appointment } from '../../appointment-booking/appointment-booking/appointment-booking.service';
import { DateService } from '../../shared/_services/utility/date.service';
import { ClientAppointmentsService } from './client-appointments.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-client-appointments',
    templateUrl: './client-appointments.component.html',
    styleUrls: ['./client-appointments.component.scss'],
})
export class ClientAppointmentsComponent implements OnDestroy {
    appointments: Appointment[];
    dayWithNoAppointments?: Date;
    private readonly onDestroy: Subject<void>;

    constructor(
        private route: ActivatedRoute,
        // eslint-disable-next-line no-unused-vars
        public date: DateService,
        // eslint-disable-next-line no-unused-vars
        private clientAppointments: ClientAppointmentsService
    ) {
        this.appointments = route.snapshot.data['appointments'];
        this.onDestroy = new Subject<void>();
    }

    ngOnDestroy() {
        this.onDestroy.next();
    }

    handleDateSelectionChange(date: Date) {
        this.clientAppointments
            .getAppointments(date)
            .pipe(takeUntil(this.onDestroy))
            .subscribe((appointments) => {
                this.appointments = appointments;
                if (appointments.length === 0) {
                    this.dayWithNoAppointments = date;
                }
            });
    }
}
