import { Request } from 'express';

export interface AddServiceToAppointment extends Request {
    params: { appointmentId: string };
    body: { serviceId: string };
}

export interface RemoveServiceFromAppointment extends Request {
    params: { appointmentId: string; serviceId: string };
}
