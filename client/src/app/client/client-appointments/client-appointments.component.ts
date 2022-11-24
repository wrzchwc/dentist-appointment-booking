/*eslint no-unused-vars: */
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DateService } from '../../shared/_services/utility/date.service';
import { Appointment, ClientAppointmentsService } from './client-appointments.service';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
    selector: 'app-client-appointments',
    templateUrl: './client-appointments.component.html',
    styleUrls: ['./client-appointments.component.scss'],
})
export class ClientAppointmentsComponent implements OnDestroy {
    appointments: Appointment[];
    readonly pickerControl: FormControl<Date>;
    private readonly onDestroy: Subject<void>;

    constructor(
        public date: DateService,
        private clientAppointments: ClientAppointmentsService,
        private builder: FormBuilder,
        private route: ActivatedRoute
    ) {
        this.appointments = route.snapshot.data['appointments'];
        this.onDestroy = new Subject<void>();
        this.pickerControl = builder.control(date.currentWorkday, { nonNullable: true });
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
