import { Request } from 'express';

interface AppointmentRequest extends Request {
    params: { appointmentId: string };
}

export interface AddServiceToAppointment extends AppointmentRequest {
    body: { serviceId: string };
}

export interface RemoveServiceFromAppointment extends Request {
    params: { appointmentId: string; serviceId: string };
}

export interface AddFactToAppointment extends AppointmentRequest {
    body: { factId: string; additionalInfo?: string };
}

export interface RemoveAppointmentFactor extends Request {
    params: { appointmentId: string; factId: string };
}

export interface UpdateAppointmentStartDate extends AppointmentRequest {
    body: { startsAt: Date };
}

export interface UpdateAppointmentConfirmedStatus extends AppointmentRequest {
    body: { confirmed: true };
}

export interface GetAppointmentsQuery {
    after?: Date;
    before?: Date;
}

export interface GetAppointments extends Request {
    query: GetAppointmentsQuery;
}
