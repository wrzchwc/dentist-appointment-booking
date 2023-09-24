import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ClientAppointmentsService } from './client-appointments.service';
import { DateService } from '../../shared/_services/utility/date.service';
import { Appointment } from '../client.model';

@Injectable({
    providedIn: 'root',
})
export class ClientAppointmentsResolver implements Resolve<Appointment[]> {
    constructor(
        private readonly clientAppointmentsService: ClientAppointmentsService,
        private readonly dateService: DateService
    ) {}

    resolve(): Observable<Appointment[]> {
        return this.clientAppointmentsService.getAppointments(this.dateService.currentWorkday);
    }
}
