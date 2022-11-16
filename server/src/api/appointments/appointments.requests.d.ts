import { Appointment, AppointmentsServices, HealthSurvey } from '../../models';
import { BelongsToManyAddAssociationMixinOptions, CreationAttributes } from 'sequelize';
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
    services: AssociationCreationAttribute<AppointmentsServices>[];
    facts?: AssociationCreationAttribute<HealthSurvey>[];
}

export interface AssociationCreationAttribute extends Identifiable {
    options: BelongsToManyAddAssociationMixinOptions;
}

interface Identifiable {
    id: string;
}
