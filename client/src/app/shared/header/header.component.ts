import { Component } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication/authentication.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
    // eslint-disable-next-line no-unused-vars
    constructor(public auth: AuthenticationService) {}
}
