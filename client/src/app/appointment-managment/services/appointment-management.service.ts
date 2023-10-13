import { inject, Injectable } from '@angular/core';
import { AppointmentManagement } from './model';
import { iif, Observable } from 'rxjs';
import { ClientAppointmentManagementService } from './client-appointment-management.service';
import { AdminAppointmentManagementService } from './admin-appointment-management.service';
import { AuthenticationService } from '../../shared/services/authentication.service';

@Injectable()
export class AppointmentManagementService implements AppointmentManagement {
    private readonly clientService: AppointmentManagement = inject(ClientAppointmentManagementService);
    private readonly adminService: AppointmentManagement = inject(AdminAppointmentManagementService);
    private readonly authenticationService: AuthenticationService = inject(AuthenticationService);

    cancelAppointment(appointmentId: string): Observable<string> {
        return iif(
            () => !!this.authenticationService.profile?.isAdmin,
            this.adminService.cancelAppointment(appointmentId),
            this.clientService.cancelAppointment(appointmentId)
        );
    }
}
