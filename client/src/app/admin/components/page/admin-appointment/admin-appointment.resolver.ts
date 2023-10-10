import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminAppointmentService } from './admin-appointment.service';
import { AdminAppointmentPreview } from '../../../../shared';

@Injectable({
    providedIn: 'root',
})
export class AdminAppointmentResolver implements Resolve<AdminAppointmentPreview> {
    constructor(private readonly appointment: AdminAppointmentService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<AdminAppointmentPreview> {
        return this.appointment.getAppointment(route.params['appointmentId']);
    }
}
