import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AppointmentManagement } from './model';

@Injectable()
export class ClientAppointmentManagementService implements AppointmentManagement {
    private readonly baseUrl: string = `${environment.apiUrl}/api/appointments/me`;

    constructor(private readonly httpClient: HttpClient) {}

    cancelAppointment(appointmentId: string): Observable<string> {
        return this.httpClient.delete(`${this.baseUrl}/${appointmentId}`, { responseType: 'text' });
    }
}
