import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';

interface AppointmentFact {
    id: string;
    value: string;
}

interface AppointmentQuestionBase {
    id: string;
    question: string;
    subquestion: string | null;
    womenOnly: boolean;
}

interface AppointmentQuestionResponse extends AppointmentQuestionBase {
    AppointmentFact: AppointmentFact;
}

export interface AppointmentQuestion extends AppointmentQuestionBase {
    fact: AppointmentFact;
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

    getAppointmentQuestions(): Observable<AppointmentQuestion[]> {
        return this.client
            .get<AppointmentQuestionResponse[]>(this.baseUrl)
            .pipe(map((response) => response.map(this.mapToAppointmentQuestion)));
    }

    private mapToAppointmentQuestion(response: AppointmentQuestionResponse): AppointmentQuestion {
        const { id, question, subquestion, womenOnly, AppointmentFact } = response;
        return { id, question, subquestion, womenOnly, fact: AppointmentFact };
    }
}
