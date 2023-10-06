import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Profile } from '../model';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    private readonly baseUrl: string = `${environment.apiUrl}/api`;

    profile?: Profile;
    authenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private client: HttpClient) {}

    getProfile(): Observable<Profile> {
        return this.client.get<Profile>(`${this.baseUrl}/users/me`);
    }
}
