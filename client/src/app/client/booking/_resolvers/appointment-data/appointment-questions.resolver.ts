import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import {
    AppointmentQuestion,
    AppointQuestionsService,
} from '../../_services/appointment-questions/appoint-questions.service';

@Injectable({
    providedIn: 'root',
})
export class AppointmentQuestionsResolver implements Resolve<AppointmentQuestion[]> {
    // eslint-disable-next-line no-unused-vars
    constructor(private appointmentQuestions: AppointQuestionsService) {}

    resolve(): Observable<AppointmentQuestion[]> {
        return this.appointmentQuestions.getAppointmentQuestions();
    }
}
