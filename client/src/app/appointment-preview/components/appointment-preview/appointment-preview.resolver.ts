import { ActivatedRouteSnapshot } from '@angular/router';
import { Appointment } from './model';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { AppointmentPreviewService } from './appointment-preview.service';

export function appointmentPreviewResolver(route: ActivatedRouteSnapshot): Observable<Appointment> {
    return inject(AppointmentPreviewService).getAppointment(route.params['appointmentId']);
}
