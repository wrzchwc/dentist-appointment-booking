import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Appointment } from '../../appointment-booking/appointment-booking/appointment-booking.service';
import { DateService } from '../../shared/_services/utility/date.service';
import { ClientService } from './client.service';

@Injectable({
    providedIn: 'root',
})
export class ClientResolver implements Resolve<Appointment[]> {
    // eslint-disable-next-line no-unused-vars
    constructor(private client: ClientService, private date: DateService) {}

    resolve(): Observable<Appointment[]> {
        return this.client.getAppointments(this.date.currentDay);
    }
}
