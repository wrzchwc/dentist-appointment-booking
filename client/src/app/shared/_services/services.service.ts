import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Service } from '../shared.model';

@Injectable({
    providedIn: 'root',
})
export class ServicesService {
    private readonly baseUrl = `${environment.apiUrl}/api/services`;

    constructor(private client: HttpClient) {}

    getServices() {
        return this.client.get<Service[]>(this.baseUrl);
    }
}
