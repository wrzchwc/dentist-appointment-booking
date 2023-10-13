import { Injectable } from '@angular/core';
import { Appointment, AppointmentPreview } from './model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ClientAppointmentPreviewService implements AppointmentPreview {
    private readonly baseUrl: string = `${environment.apiUrl}/api/appointments/me`;

    constructor(private readonly httpClient: HttpClient) {}

    getAppointment(appointmentId: string): Observable<Appointment> {
        return this.httpClient.get<Appointment>(`${this.baseUrl}/${appointmentId}`);
    }
}
