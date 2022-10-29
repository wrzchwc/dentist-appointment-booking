import { Component } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication/authentication.service';

@Component({
    selector: 'app-client',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.scss'],
})
export class ClientComponent {
    // eslint-disable-next-line no-unused-vars
    constructor(public auth: AuthenticationService) {}
}
