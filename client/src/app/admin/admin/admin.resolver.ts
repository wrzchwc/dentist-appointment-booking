import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminService, Appointment } from './admin.service';
import { DateService } from '../../shared/_services/utility/date.service';

@Injectable({
    providedIn: 'root',
})
export class AdminResolver implements Resolve<Appointment[]> {
    // eslint-disable-next-line no-unused-vars
    constructor(private admin: AdminService, private date: DateService) {}

    resolve(): Observable<Appointment[]> {
        return this.admin.getAppointments(this.date.currentDay);
    }
}
