import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AppointmentDateService {
    readonly selectedDate$: BehaviorSubject<Date | null>;
    private readonly baseUrl: string;

    // eslint-disable-next-line no-unused-vars
    constructor(private httpClient: HttpClient) {
        this.selectedDate$ = new BehaviorSubject<Date | null>(null);
        this.baseUrl = `${environment.apiUrl}/api/appointments/available-dates`;
    }

    getAvailableDates(date: Date, length: number): Observable<Date[]> {
        return this.httpClient.get<Date[]>(this.baseUrl, { params: { date: date.toISOString(), length } });
    }
}
