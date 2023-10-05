import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminAppointmentsService, Appointment } from './admin-appointments.service';
import { DateService } from '../../shared/services/date.service';

@Injectable({
    providedIn: 'root',
})
export class AdminAppointmentsResolver implements Resolve<Appointment[]> {
    constructor(private readonly appointments: AdminAppointmentsService, private readonly date: DateService) {}

    resolve(): Observable<Appointment[]> {
        return this.appointments.getAppointments(this.date.currentWorkday);
    }
}
