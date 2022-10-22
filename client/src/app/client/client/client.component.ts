import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthenticationService, Profile } from '../../_services/authentication/authentication.service';

@Component({
    selector: 'app-client',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.scss'],
})
export class ClientComponent {
    signOutUrl: string;
    profile?: Profile;

    // eslint-disable-next-line no-unused-vars
    constructor(private authentication: AuthenticationService) {
        console.log('client');
        this.signOutUrl = `${environment.apiUrl}/v1/auth/sign-out`;
    }

    handleShowProfile() {
        this.authentication.getProfile().subscribe((profile) => {
            this.profile = profile;
        });
    }
}
