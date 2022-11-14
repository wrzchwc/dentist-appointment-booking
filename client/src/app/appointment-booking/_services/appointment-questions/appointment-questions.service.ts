import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export interface AppointmentQuestion {
    id: string;
    question: string;
    subquestion: string | null;
    womenOnly: boolean;
    fact: { value: string };
}

@Injectable({
    providedIn: 'root',
})
export class AppointmentQuestionsService {
    baseUrl: string;

    // eslint-disable-next-line no-unused-vars
    constructor(private client: HttpClient) {
        this.baseUrl = `${environment.apiUrl}/api/appointments/questions`;
    }

    getAppointmentQuestions(): Observable<AppointmentQuestion[]> {
        return this.client.get<AppointmentQuestion[]>(this.baseUrl);
    }
}
