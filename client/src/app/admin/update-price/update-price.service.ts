import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Service } from '../../shared/_services/services.service';

@Injectable({
    providedIn: 'root',
})
export class UpdatePriceService {
    private readonly baseUrl: string;

    // eslint-disable-next-line no-unused-vars
    constructor(private client: HttpClient) {
        this.baseUrl = `${environment.apiUrl}/api/services`;
    }

    updateServicePrice(serviceId: string, price: number) {
        return this.client.patch<Service>(`${this.baseUrl}/${serviceId}`, { price });
    }
}
