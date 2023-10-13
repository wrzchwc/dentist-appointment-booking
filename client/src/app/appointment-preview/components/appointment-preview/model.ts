import { Observable } from 'rxjs';
import { AssociatedService } from '../../../shared';
import { User } from '../../../admin/components/page/admin-appointment/model';

export interface AppointmentPreview {
    getAppointment(appointmentId: string): Observable<Appointment>;
}

export interface Appointment {
    readonly id: string;
    readonly startsAt: Date;
    readonly services: AssociatedService[];
    readonly facts?: Fact[];
    readonly user?: User;
}

interface Fact {
    readonly id: string;
    readonly value: string;
    readonly healthSurvey: HealthSurvey;
}

interface HealthSurvey {
    readonly additionalInfo: string | null;
}
