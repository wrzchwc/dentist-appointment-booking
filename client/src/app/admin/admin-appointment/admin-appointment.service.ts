import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User as Base } from '../admin-appointments/admin-appointments.service';
import { AssociatedService } from '../../client/client-appointments/client-appointments.service';

@Injectable({
    providedIn: 'root',
})
export class AdminAppointmentService {
    private readonly baseUrl: string;

    // eslint-disable-next-line no-unused-vars
    constructor(private client: HttpClient) {
        this.baseUrl = `${environment.apiUrl}/api/appointments`;
    }

    getAppointment(appointmentId: string) {
        return this.client.get<Appointment>(`${this.baseUrl}/${appointmentId}`);
    }

    cancelAppointment(appointmentId: string) {
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

interface User extends Base {
    email: string;
    photoUrl: string;
}
