import { Appointment, AppointmentsServices, HealthSurvey } from '../../models';
import { CreationAttributes } from 'sequelize';
import { Request } from 'express';

export interface UpdateAppointmentStartDate extends Request {
    params: { appointmentId: string };
    body: { startsAt: Date };
}

export interface GetAppointments extends Request {
    query: GetAppointmentsQuery;
}

export interface GetAppointmentsQuery {
    after?: Date;
    before?: Date;
}

export interface CreateAppointment extends Request {
    body: CreateAppointmentBody;
}

interface CreateAppointmentBody extends CreationAttributes<Appointment> {
    services: ServiceAssociationCreationAttributes[];
    facts?: FactAssociationCreationAttributes[];
}

export interface ServiceAssociationCreationAttributes extends Identifiable, CreationAttributes<AppointmentsServices> {}

export interface FactAssociationCreationAttributes extends Identifiable, CreationAttributes<HealthSurvey> {}

interface Identifiable {
    id: string;
}
