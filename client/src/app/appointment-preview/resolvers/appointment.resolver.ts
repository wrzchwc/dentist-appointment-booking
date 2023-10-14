import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { AppointmentPreviewClientService } from '../services/appointment-preview-client.service';
import { AppointmentPreview } from '../model';

export function appointmentResolver(route: ActivatedRouteSnapshot): Observable<AppointmentPreview> {
    return inject(AppointmentPreviewClientService).getAppointment(route.params['appointmentId']);
}
