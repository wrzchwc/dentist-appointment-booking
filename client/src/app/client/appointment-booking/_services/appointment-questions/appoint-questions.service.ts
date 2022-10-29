import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export interface AppointmentQuestion {
    id: string;
    question: string;
    subquestion: string | null;
    womenOnly: boolean;
    factId: string;
}

@Injectable({
    providedIn: 'root',
})
export class AppointQuestionsService {
    baseUrl: string;

    // eslint-disable-next-line no-unused-vars
    constructor(private client: HttpClient) {
        this.baseUrl = `${environment.apiUrl}/api/appointments/questions`;
    }

    getAppointmentQuestions() {
        return this.client.get<AppointmentQuestion[]>(this.baseUrl);
    }
}
