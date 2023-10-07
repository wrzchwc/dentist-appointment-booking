import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Appointment } from '../admin-appointments/admin-appointments.service';
import { Observable } from 'rxjs';
import { DateTime } from 'luxon';

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    private readonly baseUrl: string = `${environment.apiUrl}/api/appointments`;

    constructor(private readonly httpClient: HttpClient) {
    }

    getAppointments(after: Date): Observable<Appointment[]> {
        return this.httpClient.get<Appointment[]>(this.baseUrl, {
            params: {
                after: after.toISOString(),
                before: DateTime.fromJSDate(after)
                    .set({ hour: 17, minute: 0, second: 0, millisecond: 0 })
                    .toJSDate()
                    .toISOString(),
            },
        });
    }
}
