import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Appointment } from '../../model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ClientAppointmentService {
    private readonly baseUrl: string = `${environment.apiUrl}/api/appointments/me`;

    constructor(private readonly httpClient: HttpClient) {}

    getAppointment(appointmentId: string): Observable<Appointment> {
        return this.httpClient.get<Appointment>(`${this.baseUrl}/${appointmentId}`);
    }

    cancelAppointment(appointmentId: string) {
        return this.httpClient.delete(`${this.baseUrl}/${appointmentId}`, { responseType: 'text' });
    }
}
