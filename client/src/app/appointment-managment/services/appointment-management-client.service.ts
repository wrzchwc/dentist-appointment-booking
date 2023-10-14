import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppointmentUrlService } from '../../shared/services/appointment-url.service';

@Injectable()
export class AppointmentManagementClientService {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly appointmentUrlService: AppointmentUrlService
    ) {}

    cancelAppointment(appointmentId: string): Observable<string> {
        const url: string = `${this.appointmentUrlService.baseUrl}/${appointmentId}`;
        return this.httpClient.delete(url, { responseType: 'text' });
    }
}
