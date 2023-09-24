import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Profile } from '../../shared.model';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    baseUrl: string;
    profile?: Profile;
    authenticated$: BehaviorSubject<boolean>;

    // eslint-disable-next-line no-unused-vars
    constructor(private client: HttpClient) {
        this.baseUrl = `${environment.apiUrl}/api`;
        this.authenticated$ = new BehaviorSubject<boolean>(false);
    }

    getProfile() {
        return this.client.get<Profile>(`${this.baseUrl}/users/me`);
    }
}
