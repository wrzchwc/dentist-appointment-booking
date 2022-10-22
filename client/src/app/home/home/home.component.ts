import { Component } from '@angular/core';
import { environment } from './../../../environments/environment';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
    signInLink: string;

    // eslint-disable-next-line no-unused-vars
    constructor() {
        console.log('home');
        this.signInLink = `${environment.apiUrl}/v1/auth/google`;
    }
}
