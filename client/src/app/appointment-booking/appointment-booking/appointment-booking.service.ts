import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AssociatedService } from '../../shared/_services/services.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AppointmentBookingService {
    private readonly baseUrl: string;

    // eslint-disable-next-line no-unused-vars
    constructor(private client: HttpClient) {
        this.baseUrl = `${environment.apiUrl}/api/appointments`;
    }

    getAppointments(current: Date) {
        const copy = new Date(current);
        return this.client.get<Appointment[]>(this.baseUrl, {
            params: {
                after: current.toISOString(),
                before: new Date(copy.setHours(17, 0, 0, 0)).toISOString(),
            },
        });
    }

    createAppointment(startsAt: Date, services: IdQuantity[], facts?: IdInfo[]) {
        return this.client.post(this.baseUrl, { startsAt, services, facts });
    }

    getAppointmentQuestions(): Observable<AppointmentQuestion[]> {
        return this.client.get<AppointmentQuestion[]>(`${this.baseUrl}/questions`);
    }
}

export interface Appointment {
    id: string;
    startsAt: Date;
    services: AssociatedService[];
}

interface Id {
    id: string;
}

export interface IdQuantity extends Id {
    quantity: number;
}

export interface IdInfo extends Id {
    additionalInfo?: string;
}

export interface AppointmentQuestion {
    id: string;
    question: string;
    subquestion: string | null;
    womenOnly: boolean;
    fact: { value: string; id: string };
}
