import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
    signOutUrl: string;

    constructor() {
        this.signOutUrl = `${environment.apiUrl}/api/auth/sign-out`;
    }
}
