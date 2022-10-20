import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthenticationService, Profile } from '../../.services/authentication/authentication.service';

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
        this.signOutUrl = `${environment.apiUrl}/v1/users/me`;
    }

    handleShowProfile() {
        this.authentication.getProfile().subscribe((profile) => {
            this.profile = profile;
        });
    }
}
