import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

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

    // eslint-disable-next-line no-unused-vars
    constructor(private client: HttpClient) {
        this.baseUrl = `${environment.apiUrl}/v1`;
    }

    getProfile() {
        return this.client.get<Profile>(`${this.baseUrl}/users/me`);
    }
}
