import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

export interface Profile {
    id: string;
    isAdmin: boolean;
    name: string;
    surname: string;
    email: string;
    photoUrl: string;
}

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
