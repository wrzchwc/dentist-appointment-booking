import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Appointment } from '../admin-appointments/admin-appointments.service';

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    private readonly baseUrl = `${environment.apiUrl}/api/appointments`;

    constructor(private readonly httpClient: HttpClient) {}

    getAppointments(after: Date) {
        const before = new Date(new Date(after).setHours(17, 0, 0, 0)).toISOString();
        return this.httpClient.get<Appointment[]>(this.baseUrl, { params: { after: after.toISOString(), before } });
    }
}
