import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Service } from '../../shared/shared.model';

@Injectable({
    providedIn: 'root',
})
export class UpdatePriceService {
    private readonly baseUrl = `${environment.apiUrl}/api/services`;

    constructor(private client: HttpClient) {}

    updateServicePrice(serviceId: string, price: number): Observable<Service> {
        return this.client.patch<Service>(`${this.baseUrl}/${serviceId}`, { price });
    }
}
