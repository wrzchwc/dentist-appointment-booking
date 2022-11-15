import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Service } from './services.service';

type AssociatedService = Service & { appointmentServices: { quantity: number } };

interface Appointment {
    id: string;
    startsAt: Date;
    services: AssociatedService[];
}

interface ConfirmAppointmentResponse {
    id: string;
    confirmed: true;
    startsAt: Date;
    userId: string;
}

@Injectable({
    providedIn: 'root',
})
export class AppointmentsService {
    readonly baseUrl: string;
    currentAppointment?: Appointment;

    // eslint-disable-next-line no-unused-vars
    constructor(private client: HttpClient) {
        this.baseUrl = `${environment.apiUrl}/api/appointments`;
    }

    createAppointment() {
        return this.client.post<Appointment>(this.baseUrl, {});
    }

    confirmAppointment() {
        return this.client.patch<ConfirmAppointmentResponse>(`${this.baseUrl}/${this.currentAppointment?.id}/confirm`, {
            confirmed: true,
        });
    }

    clear() {
        this.currentAppointment = undefined;
    }

    addServiceToAppointment(serviceId: string) {
        return this.client.post(
            `${this.baseUrl}/${this.currentAppointment?.id}/services`,
            { serviceId },
            { responseType: 'text' }
        );
    }

    removeServiceFromAppointment(serviceId: string) {
        return this.client.delete(`${this.baseUrl}/${this.currentAppointment?.id}/services/${serviceId}`, {
            responseType: 'text',
        });
    }
}
