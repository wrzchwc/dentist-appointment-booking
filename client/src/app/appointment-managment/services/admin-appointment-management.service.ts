import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AppointmentManagement } from './model';

@Injectable()
export class AdminAppointmentManagementService implements AppointmentManagement {
    private readonly baseUrl: string = `${environment.apiUrl}/api/appointments`;

    constructor(private readonly client: HttpClient) {}

    cancelAppointment(appointmentId: string): Observable<string> {
        return this.client.delete(`${this.baseUrl}/${appointmentId}`, { responseType: 'text' });
    }
}
