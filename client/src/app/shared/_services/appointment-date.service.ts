import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AppointmentDateService {
    readonly selectedDate$: BehaviorSubject<Date | null> = new BehaviorSubject<Date | null>(null);
    private readonly baseUrl = `${environment.apiUrl}/api/appointments/available-dates`;

    constructor(private readonly httpClient: HttpClient) {}

    getAvailableDates(date: Date, length: number): Observable<Date[]> {
        return this.httpClient.get<Date[]>(this.baseUrl, { params: { date: date.toISOString(), length } });
    }
}
