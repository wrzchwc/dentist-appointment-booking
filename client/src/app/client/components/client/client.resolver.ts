import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { DateService } from '../../../shared/services/date.service';
import { ClientService } from './client.service';
import { Appointment } from '../../model';

@Injectable({
    providedIn: 'root',
})
export class ClientResolver implements Resolve<Appointment[]> {
    constructor(private readonly clientService: ClientService, private readonly dateService: DateService) {}

    resolve(): Observable<Appointment[]> {
        return this.clientService.getAppointments(this.dateService.currentDay);
    }
}
