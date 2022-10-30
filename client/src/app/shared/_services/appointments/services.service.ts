import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

export interface Service {
    id: string;
    name: string;
    price: number | null;
    count: number;
    detail: 'A' | 'B' | 'C' | null;
    length: number | null;
}

@Injectable({
    providedIn: 'root',
})
export class ServicesService {
    baseUrl: string;

    // eslint-disable-next-line no-unused-vars
    constructor(private client: HttpClient) {
        this.baseUrl = `${environment.apiUrl}/api/appointments/services`;
    }

    getServices() {
        return this.client.get<Service[]>(this.baseUrl);
    }
}
