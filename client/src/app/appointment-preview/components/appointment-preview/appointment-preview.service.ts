import { inject, Injectable } from '@angular/core';
import { Appointment, AppointmentPreview } from './model';
import { iif, Observable } from 'rxjs';
import { AuthenticationService } from '../../../shared';
import { ClientAppointmentPreviewService } from './client-appointment-preview.service';
import { AdminAppointmentPreviewService } from './admin-appointment-preview.service';

@Injectable({
    providedIn: 'root',
})
export class AppointmentPreviewService implements AppointmentPreview {
    private readonly authentication: AuthenticationService = inject(AuthenticationService);
    private readonly clientService: AppointmentPreview = inject(ClientAppointmentPreviewService);
    private readonly adminService: AppointmentPreview = inject(AdminAppointmentPreviewService);

    getAppointment(appointmentId: string): Observable<Appointment> {
        return iif(
            () => !!this.authentication.profile?.isAdmin,
            this.adminService.getAppointment(appointmentId),
            this.clientService.getAppointment(appointmentId)
        );
    }
}
