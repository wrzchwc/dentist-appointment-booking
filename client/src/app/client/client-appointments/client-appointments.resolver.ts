import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Appointment } from '../../appointment-booking/appointment-booking/appointment-booking.service';
import { ClientAppointmentsService } from './client-appointments.service';
import { DateService } from '../../shared/_services/utility/date.service';

@Injectable({
    providedIn: 'root',
})
export class ClientAppointmentsResolver implements Resolve<Appointment[]> {
    // eslint-disable-next-line no-unused-vars
    constructor(private appointments: ClientAppointmentsService, private date: DateService) {}

    resolve(): Observable<Appointment[]> {
        return this.appointments.getAppointments(this.date.currentWorkday);
    }
}
