import { Component } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication/authentication.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
    signOutUrl: string;
    // eslint-disable-next-line no-unused-vars
    constructor(public auth: AuthenticationService) {
        this.signOutUrl = `${environment.apiUrl}/api/auth/sign-out`;
    }
}
