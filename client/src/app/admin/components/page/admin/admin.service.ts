import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DateTime } from 'luxon';
import { AdminAppointmentPreview } from '../../../../shared';

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    private readonly baseUrl: string = `${environment.apiUrl}/api/appointments`;

    constructor(private readonly httpClient: HttpClient) {}

    getAppointments(after: Date): Observable<AdminAppointmentPreview[]> {
        return this.httpClient.get<AdminAppointmentPreview[]>(this.baseUrl, {
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
