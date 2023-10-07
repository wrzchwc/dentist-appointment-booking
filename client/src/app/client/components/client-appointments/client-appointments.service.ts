import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Appointment } from '../../model';

@Injectable({
    providedIn: 'root',
})
export class ClientAppointmentsService {
    private readonly baseUrl: string = `${environment.apiUrl}/api/appointments/me`;

    constructor(private readonly httpClient: HttpClient) {}

    getAppointments(date: Date) {
        const after = new Date(new Date(date).setHours(0, 0, 0, 0));
        const before = new Date(new Date(date).setHours(23, 59, 59, 999));

        return this.httpClient.get<Appointment[]>(this.baseUrl, {
            params: { after: after.toISOString(), before: before.toISOString() },
        });
    }
}
