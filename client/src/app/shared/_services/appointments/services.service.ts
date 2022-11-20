import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { LengthItem } from './length.service';

interface ServiceBase {
    id: string;
    name: string;
    count: 1;
    length: number;
}

interface StandardService extends ServiceBase {
    price: number;
    detail: null;
}

interface ExceptionalPriceService extends ServiceBase {
    price: null;
    detail: 'A';
}

export type Service = StandardService | ExceptionalPriceService;
export type AssociatedService = Service & { appointmentServices: { quantity: number } };

@Injectable({
    providedIn: 'root',
})
export class ServicesService {
    readonly baseUrl: string;

    // eslint-disable-next-line no-unused-vars
    constructor(private client: HttpClient) {
        this.baseUrl = `${environment.apiUrl}/api/services`;
    }

    getServices() {
        return this.client.get<Service[]>(this.baseUrl);
    }

    mapAssociatedServicesToLengthItems(services: AssociatedService[]): LengthItem[] {
        return services.map(this.mapAssociatedServiceToLengthItem);
    }

    private mapAssociatedServiceToLengthItem(service: AssociatedService): LengthItem {
        return { length: service.length, quantity: service.appointmentServices.quantity };
    }
}
