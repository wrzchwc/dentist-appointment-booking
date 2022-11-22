import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

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
}

export type Service = StandardService | ExceptionalPriceService;

interface StandardService extends ServiceBase {
    price: number;
    detail: null;
}

interface ExceptionalPriceService extends ServiceBase {
    price: null;
    detail: 'A';
}

interface ServiceBase {
    id: string;
    name: string;
    count: 1;
    length: number;
}
