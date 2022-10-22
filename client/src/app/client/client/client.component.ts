import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-client',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.scss'],
})
export class ClientComponent {
    signOutUrl: string;

    constructor() {
        this.signOutUrl = `${environment.apiUrl}/v1/auth/sign-out`;
    }
}
