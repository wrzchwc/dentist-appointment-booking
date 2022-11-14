import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import * as aqs from '../../_services/appointment-questions/appointment-questions.service';

@Injectable({
    providedIn: 'root',
})
export class AppointmentQuestionsResolver implements Resolve<aqs.AppointmentQuestion[]> {
    // eslint-disable-next-line no-unused-vars
    constructor(private appointmentQuestions: aqs.AppointmentQuestionsService) {}

    resolve(): Observable<aqs.AppointmentQuestion[]> {
        return this.appointmentQuestions.getAppointmentQuestions();
    }
}
