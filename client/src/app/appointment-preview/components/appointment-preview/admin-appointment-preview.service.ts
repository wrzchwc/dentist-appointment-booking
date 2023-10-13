import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AppointmentPreview } from './model';
import { Observable } from 'rxjs';
import { Appointment1 } from '../../../shared';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AdminAppointmentPreviewService implements AppointmentPreview {
    private readonly baseUrl = `${environment.apiUrl}/api/appointments`;

    constructor(private readonly httpClient: HttpClient) {}

    getAppointment(appointmentId: string): Observable<Appointment1> {
        return this.httpClient.get<Appointment1>(`${this.baseUrl}/${appointmentId}`);
    }
}
