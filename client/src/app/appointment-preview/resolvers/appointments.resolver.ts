import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { AppointmentPreviewClientService } from '../services/appointment-preview-client.service';
import { DateService } from '../../shared/services/date.service';
import { Appointment } from '../model';

export function appointmentsAtDateResolver(): Observable<Appointment[]> {
    return inject(AppointmentPreviewClientService).getAppointmentsAt(inject(DateService).currentWorkday);
}
