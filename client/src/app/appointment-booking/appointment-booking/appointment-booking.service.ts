import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AppointmentQuestion, Quantity, Info } from '../model';

@Injectable({
    providedIn: 'root',
})
export class AppointmentBookingService {
    private readonly baseUrl = `${environment.apiUrl}/api/appointments`;

    constructor(private client: HttpClient) {}

    createAppointment(startsAt: Date, services: Quantity[], facts?: Info[]): Observable<Object> {
        return this.client.post(this.baseUrl, { startsAt, services, facts });
    }

    getAppointmentQuestions(): Observable<AppointmentQuestion[]> {
        return this.client.get<AppointmentQuestion[]>(`${this.baseUrl}/questions`);
    }
}
