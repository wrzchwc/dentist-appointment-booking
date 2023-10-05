import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UpdateStartDateService {
    private readonly baseUrl: string = `${environment.apiUrl}/api/appointments`;

    constructor(private readonly httpClient: HttpClient) {}

    rescheduleAppointment(serviceId: string, startsAt: Date) {
        return this.httpClient.patch(`${this.baseUrl}/${serviceId}`, { startsAt });
    }
}
