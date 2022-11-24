import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Appointment } from '../admin-appointments/admin-appointments.service';
import { AdminAppointmentService } from './admin-appointment.service';

@Injectable({
    providedIn: 'root',
})
export class AdminAppointmentResolver implements Resolve<Appointment> {
    // eslint-disable-next-line no-unused-vars
    constructor(private appointment: AdminAppointmentService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Appointment> {
        return this.appointment.getAppointment(route.params['appointmentId']);
    }
}
