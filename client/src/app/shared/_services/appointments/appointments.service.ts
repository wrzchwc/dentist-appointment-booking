import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AppointmentsService {
    baseUrl: string;

    constructor() {
        this.baseUrl = `${environment.apiUrl}/api/appointments`;
    }
}
