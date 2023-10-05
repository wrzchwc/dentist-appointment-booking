import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Appointment } from '../model';

@Injectable({
    providedIn: 'root',
})
export class ClientService {
    private readonly baseUrl: string = `${environment.apiUrl}/api/appointments/me`;

    constructor(private httpClient: HttpClient) {}

    getAppointments(after: Date) {
        return this.httpClient.get<Appointment[]>(this.baseUrl, { params: { after: after.toISOString() } });
    }
}
