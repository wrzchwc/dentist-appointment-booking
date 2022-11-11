import { Request } from 'express';

export interface AddServiceToAppointment extends Request {
    params: { appointmentId: string };
    body: { serviceId: string };
}

export interface RemoveServiceFromAppointment extends Request {
    params: { appointmentId: string; serviceId: string };
}

export interface AddFactToAppointment extends Request {
    params: { appointmentId: string };
    body: { factId: string; additionalInfo?: string };
}

export interface RemoveAppointmentFactor {
    params: { appointmentId: string; factId: string };
}
