import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Appointment } from '../client-appointments/client-appointments.service';

@Injectable({
    providedIn: 'root',
})
export class ClientAppointmentService {
    private readonly baseUrl: string;

    // eslint-disable-next-line no-unused-vars
    constructor(private client: HttpClient) {
        this.baseUrl = `${environment.apiUrl}/api/appointments/me`;
    }

    getAppointment(appointmentId: string) {
        return this.client.get<Appointment>(`${this.baseUrl}/${appointmentId}`);
    }
}
