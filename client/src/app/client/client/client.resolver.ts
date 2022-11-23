import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { DateService } from '../../shared/_services/utility/date.service';
import { ClientService } from './client.service';
import { Appointment } from '../client-appointments/client-appointments.service';

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
