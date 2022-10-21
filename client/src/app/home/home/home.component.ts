import { Component } from '@angular/core';
import { environment } from './../../../environments/environment';
import { AuthenticationService } from '../../_services/authentication/authentication.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
    signInLink: string;
    signOutLink: string;

    // eslint-disable-next-line no-unused-vars
    constructor(private authentication: AuthenticationService) {
        this.signInLink = `${environment.apiUrl}/v1/auth/google`;
        this.signOutLink = `${environment.apiUrl}/v1/auth/sign-out`;
    }

    handleProfile() {
        // eslint-disable-next-line no-console
        this.authentication.getProfile().subscribe(console.log);
    }

    handleSignOut() {
        this.authentication.signOut();
    }
}
