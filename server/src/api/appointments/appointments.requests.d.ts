import { Request } from 'express';

export interface AddServiceToAppointmentRequest extends Request {
    params: { appointmentId: string };
    body: { serviceId: string };
}

export interface RemoveServiceFromAppointmentRequest extends Request {
    params: { appointmentId: string; serviceId: string };
}
