import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Appointment } from '../../model';
import { DateTime } from 'luxon';

@Injectable({
    providedIn: 'root',
})
export class ClientAppointmentsService {
    private readonly baseUrl: string = `${environment.apiUrl}/api/appointments/me`;

    constructor(private readonly httpClient: HttpClient) {}

    getAppointments(date: Date) {
        const dateTime: DateTime = DateTime.fromJSDate(date);

        return this.httpClient.get<Appointment[]>(this.baseUrl, {
            params: {
                after: dateTime.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toJSDate().toISOString(),
                before: dateTime.set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).toJSDate().toISOString(),
            },
        });
    }
}
