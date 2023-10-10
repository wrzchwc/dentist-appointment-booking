import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminService } from './admin.service';
import { DateService } from '../../../../shared/services/date.service';
import { AdminAppointmentPreview } from '../../../../shared';

@Injectable({
    providedIn: 'root',
})
export class AdminResolver implements Resolve<AdminAppointmentPreview[]> {
    constructor(private readonly admin: AdminService, private readonly date: DateService) {}

    resolve(): Observable<AdminAppointmentPreview[]> {
        return this.admin.getAppointments(this.date.currentDay);
    }
}
