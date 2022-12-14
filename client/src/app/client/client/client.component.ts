import { Component } from '@angular/core';
import { AuthenticationService } from '../../shared/_services/authentication/authentication.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-client',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.scss'],
})
export class ClientComponent {
    // eslint-disable-next-line no-unused-vars
    constructor(public auth: AuthenticationService, public route: ActivatedRoute) {}
}
