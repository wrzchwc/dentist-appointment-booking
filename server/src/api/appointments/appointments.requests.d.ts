import { Appointment } from '../../models';
import { CreationAttributes } from 'sequelize';
import { Request } from 'express';

export interface UpdateAppointmentStartDate extends Request {
    params: { appointmentId: string };
    body: { startsAt: Date };
}

export interface GetAppointments extends Request {
    query: DateRange;
}

export interface DateRange {
    after?: Date;
    before?: Date;
}

export interface CreateAppointment extends Request {
    body: CreateAppointmentBody;
}

export interface CreateAppointmentBody extends CreationAttributes<Appointment> {
    services: ServiceAssociationCreationAttribute[];
    facts?: FactAssociationCreationAttribute[];
}

export interface ServiceAssociationCreationAttribute extends Identifiable {
    quantity: number;
}

export interface FactAssociationCreationAttribute extends Identifiable {
    additionalInfo?: string;
}

interface Identifiable {
    id: string;
}

export interface GetAvailableDates extends Request {
    query: GetAvailableDatesQuery;
}

export interface GetAvailableDatesQuery {
    date: Date;
    length: number;
}
