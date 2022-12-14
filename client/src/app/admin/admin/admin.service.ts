import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Appointment } from '../admin-appointments/admin-appointments.service';

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    private readonly baseUrl: string;

    // eslint-disable-next-line no-unused-vars
    constructor(private client: HttpClient) {
        this.baseUrl = `${environment.apiUrl}/api/appointments`;
    }

    getAppointments(after: Date) {
        const before = new Date(new Date(after).setHours(17, 0, 0, 0)).toISOString();
        return this.client.get<Appointment[]>(this.baseUrl, { params: { after: after.toISOString(), before } });
    }
}
