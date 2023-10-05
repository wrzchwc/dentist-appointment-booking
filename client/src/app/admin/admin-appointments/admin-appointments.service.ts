import { Injectable } from '@angular/core';
import { Appointment as Base } from '../../shared/appointments/appointments.component';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AdminAppointmentsService {
    private readonly baseUrl = `${environment.apiUrl}/api/appointments`;

    constructor(private client: HttpClient) {}

    getAppointments(date: Date): Observable<Appointment[]> {
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
