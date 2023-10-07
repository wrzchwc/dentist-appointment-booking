import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Service } from '../model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ServicesService {
    private readonly baseUrl = `${environment.apiUrl}/api/services`;

    constructor(private readonly client: HttpClient) {}

    getServices(): Observable<Service[]> {
        return this.client.get<Service[]>(this.baseUrl);
    }
}
