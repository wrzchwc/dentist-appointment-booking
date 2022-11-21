import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Appointment } from '../../appointment-booking/appointment-booking/appointment-booking.service';

@Injectable({
    providedIn: 'root',
})
export class ClientService {
    private readonly baseUrl: string;

    // eslint-disable-next-line no-unused-vars
    constructor(private client: HttpClient) {
        this.baseUrl = `${environment.apiUrl}/api/appointments/me`;
    }

    getAppointments(after: Date) {
        return this.client.get<Appointment[]>(this.baseUrl, { params: { after: after.toISOString() } });
    }
}
