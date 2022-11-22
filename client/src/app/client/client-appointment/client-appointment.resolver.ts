import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ClientAppointmentService } from './client-appointment.service';
import { Appointment } from '../client-appointments/client-appointments.service';

@Injectable({
    providedIn: 'root',
})
export class ClientAppointmentResolver implements Resolve<Appointment> {
    // eslint-disable-next-line no-unused-vars
    constructor(private appointment: ClientAppointmentService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Appointment> {
        return this.appointment.getAppointment(route.params['appointmentId']);
    }
}
