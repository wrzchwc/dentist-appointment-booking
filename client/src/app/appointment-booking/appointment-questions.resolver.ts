import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { AppointmentBookingService, AppointmentQuestion } from './appointment-booking/appointment-booking.service';

@Injectable({
    providedIn: 'root',
})
export class AppointmentQuestionsResolver implements Resolve<AppointmentQuestion[]> {
    // eslint-disable-next-line no-unused-vars
    constructor(private booking: AppointmentBookingService) {}

    resolve(): Observable<AppointmentQuestion[]> {
        return this.booking.getAppointmentQuestions();
    }
}
