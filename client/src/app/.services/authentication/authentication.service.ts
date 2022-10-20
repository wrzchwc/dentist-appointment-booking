import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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

    constructor(private client: HttpClient) {
        this.baseUrl = `${environment.apiUrl}/v1`;
    }

    signOut() {
        return this.client.get(`${this.baseUrl}/auth/sign-out`, { withCredentials: true });
    }

    getProfile() {
        return this.client.get<Profile>(`${this.baseUrl}/users/me`, { withCredentials: true });
    }
}
