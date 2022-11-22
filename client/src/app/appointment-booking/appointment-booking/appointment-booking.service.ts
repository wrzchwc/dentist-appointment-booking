import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { IdInfo } from '../health-state/health-state.service';
import { IdQuantity } from '../appointment-cart.service';

@Injectable({
    providedIn: 'root',
})
export class AppointmentBookingService {
    private readonly baseUrl: string;

    // eslint-disable-next-line no-unused-vars
    constructor(private client: HttpClient) {
        this.baseUrl = `${environment.apiUrl}/api/appointments`;
    }

    createAppointment(startsAt: Date, services: IdQuantity[], facts?: IdInfo[]) {
        return this.client.post(this.baseUrl, { startsAt, services, facts });
    }

    getAppointmentQuestions(): Observable<AppointmentQuestion[]> {
        return this.client.get<AppointmentQuestion[]>(`${this.baseUrl}/questions`);
    }
}

export interface AppointmentQuestion {
    id: string;
    question: string;
    subquestion: string | null;
    womenOnly: boolean;
    fact: { value: string; id: string };
}
