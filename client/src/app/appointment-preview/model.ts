import { AssociatedService } from '../shared';

export interface User {
    id: string;
    name: string;
    surname: string;
    email: string;
    photoUrl: string;
}

export interface AppointmentPreview {
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

export interface Appointment {
    readonly id: string;
    readonly startsAt: Date;
    readonly services: Service[];
    readonly user?: User;
}

interface Service {
    readonly id: string;
    readonly name: string;
    readonly appointmentServices?: ServiceAssociation;
    readonly count?: 1;
    readonly length?: number;
    price?: number | null;
    readonly detail?: 'A' | null;
}

interface ServiceAssociation {
    readonly quantity: number;
}
