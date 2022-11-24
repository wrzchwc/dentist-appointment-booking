import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminAppointmentsService, Appointment } from './admin-appointments.service';
import { DateService } from '../../shared/_services/utility/date.service';

@Injectable({
    providedIn: 'root',
})
export class AdminAppointmentsResolver implements Resolve<Appointment[]> {
    // eslint-disable-next-line no-unused-vars
    constructor(private appointments: AdminAppointmentsService, private date: DateService) {}

    resolve(): Observable<Appointment[]> {
        return this.appointments.getAppointments(this.date.currentWorkday);
    }
}
