import { Component } from '@angular/core';
import { environment } from './../../../environments/environment';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
    signInLink: string;

    constructor() {
        this.signInLink = `${environment.apiUrl}/api/auth/google`;
    }
}
