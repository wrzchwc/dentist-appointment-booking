import { Injectable } from '@angular/core';
import { Appointment as Base } from '../../shared/appointments/appointments.component';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class AdminAppointmentsService {
    private readonly baseUrl;

    // eslint-disable-next-line no-unused-vars
    constructor(private client: HttpClient) {
        this.baseUrl = `${environment.apiUrl}/api/appointments`;
    }

    getAppointments(date: Date) {
        const after = new Date(new Date(date).setHours(0, 0, 0, 0));
        const before = new Date(new Date(date).setHours(23, 59, 59, 999));
        return this.client.get<Appointment[]>(this.baseUrl, {
            params: { after: after.toISOString(), before: before.toISOString() },
        });
    }
}

export interface Appointment extends Base {
    user: User;
}

export interface User {
    id: string;
    name: string;
    surname: string;
}
