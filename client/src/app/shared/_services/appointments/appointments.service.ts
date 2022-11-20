import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AssociatedService } from './services.service';

export interface Appointment {
    id: string;
    startsAt: Date;
    services: AssociatedService[];
}

export interface IdQuantity {
    id: string;
    quantity: number;
}

@Injectable({
    providedIn: 'root',
})
export class AppointmentsService {
    readonly baseUrl: string;

    // eslint-disable-next-line no-unused-vars
    constructor(private client: HttpClient) {
        this.baseUrl = `${environment.apiUrl}/api/appointments`;
    }

    getAppointments(current: Date) {
        const copy = new Date(current);
        return this.client.get<Appointment[]>(this.baseUrl, {
            params: {
                after: current.toISOString(),
                before: new Date(copy.setHours(17, 0, 0, 0)).toISOString(),
            },
        });
    }

    createAppointment(startsAt: Date, services: IdQuantity[]) {
        return this.client.post(this.baseUrl, { startsAt, services });
    }
}
