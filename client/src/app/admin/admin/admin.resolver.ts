import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminService } from './admin.service';
import { DateService } from '../../shared/services/date.service';
import { Appointment } from '../admin-appointments/admin-appointments.service';

@Injectable({
    providedIn: 'root',
})
export class AdminResolver implements Resolve<Appointment[]> {
    constructor(private readonly admin: AdminService, private readonly date: DateService) {}

    resolve(): Observable<Appointment[]> {
        return this.admin.getAppointments(this.date.currentDay);
    }
}
