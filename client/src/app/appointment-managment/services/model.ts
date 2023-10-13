import { Observable } from 'rxjs';

export interface AppointmentManagement {
    cancelAppointment(appointmentId: string): Observable<string>;
}
