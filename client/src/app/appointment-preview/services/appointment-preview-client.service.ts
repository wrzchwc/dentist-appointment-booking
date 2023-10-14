import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppointmentUrlService } from '../../shared/services/appointment-url.service';
import { HttpClient } from '@angular/common/http';
import { DateObjectUnits, DateTime } from 'luxon';
import { Appointment, AppointmentPreview } from '../model';

@Injectable()
export class AppointmentPreviewClientService {
    private readonly START: DateObjectUnits = { hour: 0, minute: 0, second: 0, millisecond: 0 };
    private readonly END: DateObjectUnits = { hour: 23, minute: 59, second: 59, millisecond: 999 };

    constructor(
        private readonly appointmentUrlService: AppointmentUrlService,
        private readonly httpClient: HttpClient
    ) {}

    getAppointment(appointmentId: string): Observable<AppointmentPreview> {
        return this.httpClient.get<AppointmentPreview>(`${this.appointmentUrlService.baseUrl}/${appointmentId}`);
    }

    getAppointmentsAt(date: Date): Observable<Appointment[]> {
        const dateTime: DateTime = DateTime.fromJSDate(date);
        return this.httpClient.get<Appointment[]>(this.appointmentUrlService.baseUrl, {
            params: {
                after: dateTime.set(this.START).toJSDate().toISOString(),
                before: dateTime.set(this.END).toJSDate().toISOString(),
            },
        });
    }
}
