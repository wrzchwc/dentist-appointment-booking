import { AssociatedService } from '../shared/model';

export interface Appointment {
    readonly id: string;
    readonly startsAt: Date;
    readonly services: AssociatedService[];
}
