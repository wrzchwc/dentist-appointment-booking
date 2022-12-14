import { Component } from '@angular/core';
import { AuthenticationService } from './shared/_services/authentication/authentication.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    // eslint-disable-next-line no-unused-vars
    constructor(public auth: AuthenticationService) {}
}
