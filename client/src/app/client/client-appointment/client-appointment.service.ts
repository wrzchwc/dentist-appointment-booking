import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Appointment } from '../client.model';

@Injectable({
    providedIn: 'root',
})
export class ClientAppointmentService {
    private readonly baseUrl: string = `${environment.apiUrl}/api/appointments/me`;

    constructor(private httpClient: HttpClient) {}

    getAppointment(appointmentId: string) {
        return this.httpClient.get<Appointment>(`${this.baseUrl}/${appointmentId}`);
    }

    cancelAppointment(appointmentId: string) {
        return this.httpClient.delete(`${this.baseUrl}/${appointmentId}`, { responseType: 'text' });
    }
}
