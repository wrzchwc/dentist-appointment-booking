import { Request } from 'express';

export interface UpdateAppointmentStartDate extends Request {
    params: { appointmentId: string };
    body: { startsAt: Date };
}

export interface GetAppointmentsQuery {
    after?: Date;
    before?: Date;
}

export interface GetAppointments extends Request {
    query: GetAppointmentsQuery;
}
