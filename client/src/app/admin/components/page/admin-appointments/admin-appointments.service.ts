import { Injectable } from '@angular/core';
import { Appointment as Base } from '../../../../shared/components/page/appointments/appointments.component';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../model';
import { Observable } from 'rxjs';
import { DateTime } from 'luxon';

@Injectable({
    providedIn: 'root',
})
export class AdminAppointmentsService {
    private readonly baseUrl: string = `${environment.apiUrl}/api/appointments`;

    constructor(private readonly client: HttpClient) {}

    getAppointments(date: Date): Observable<Appointment[]> {
        const dateTime: DateTime = DateTime.fromJSDate(date);

        return this.client.get<Appointment[]>(this.baseUrl, {
            params: {
                after: dateTime.set({hour: 0, minute: 0, second: 0, millisecond: 0}).toJSDate().toISOString(),
                before: dateTime.set({hour: 23, minute: 59, second: 59, millisecond: 999}).toJSDate().toISOString()
            },
        });
    }
}

export interface Appointment extends Base {
    user: User;
}
