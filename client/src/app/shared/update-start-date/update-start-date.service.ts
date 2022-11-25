import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UpdateStartDateService {
    private readonly baseUrl: string;

    // eslint-disable-next-line no-unused-vars
    constructor(private client: HttpClient) {
        this.baseUrl = `${environment.apiUrl}/api/appointments`;
    }

    rescheduleAppointment(serviceId: string, startsAt: Date) {
        return this.client.patch(`${this.baseUrl}/${serviceId}`, { startsAt });
    }
}
