import { AssociatedService } from '../shared/shared.model';

export interface Appointment {
    readonly id: string;
    readonly startsAt: Date;
    readonly services: AssociatedService[];
}
