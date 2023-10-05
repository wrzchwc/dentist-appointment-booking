import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AssociatedService } from '../../shared/model';
import { Observable } from 'rxjs';
import { User } from './model';

@Injectable({
    providedIn: 'root',
})
export class AdminAppointmentService {
    private readonly baseUrl = `${environment.apiUrl}/api/appointments`;

    constructor(private readonly client: HttpClient) {}

    getAppointment(appointmentId: string): Observable<Appointment> {
        return this.client.get<Appointment>(`${this.baseUrl}/${appointmentId}`);
    }

    cancelAppointment(appointmentId: string): Observable<string> {
        return this.client.delete(`${this.baseUrl}/${appointmentId}`, { responseType: 'text' });
    }
}

export interface Appointment {
    id: string;
    startsAt: Date;
    facts: Fact[];
    services: AssociatedService[];
    user: User;
}

interface Fact {
    id: string;
    value: string;
    healthSurvey: {
        additionalInfo: string | null;
    };
}
