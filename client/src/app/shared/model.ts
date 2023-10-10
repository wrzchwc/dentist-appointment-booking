import { User } from '../admin/components/page/admin-appointment/model';

export interface Service {
    readonly id: string;
    readonly name: string;
    readonly count: 1;
    readonly length: number;
    price: number | null;
    readonly detail: 'A' | null;
}

export interface AssociatedService extends Service {
    readonly appointmentServices: AppointmentServices;
}

interface AppointmentServices {
    readonly quantity: number;
}

export interface PriceItem {
    readonly price: number | null;
    readonly detail: 'A' | 'B' | 'C' | null;
    readonly quantity: number;
}

export interface NamedPriceItem extends PriceItem {
    readonly name: string;
}

export interface Profile {
    readonly id: string;
    readonly isAdmin: boolean;
    readonly name: string;
    readonly surname: string;
    readonly email: string;
    readonly photoUrl: string;
}

export interface LengthItem {
    readonly quantity: number;
    readonly length: number;
}

export interface Appointment1 {
    readonly id: string;
    readonly startsAt: Date;
    readonly facts: Fact[];
    readonly services: AssociatedService[];
    readonly user: User;
}

interface Fact {
    readonly id: string;
    readonly value: string;
    readonly healthSurvey: HealthSurvey;
}

interface HealthSurvey {
    readonly additionalInfo: string | null;
}

export interface AppointmentPreview {
    id: string;
    startsAt: Date;
    services: ServicePreview[];
}

interface ServicePreview {
    id: string;
    name: string;
}

export interface AdminAppointmentPreview extends AppointmentPreview {
    user: User;
}
