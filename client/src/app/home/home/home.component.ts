import { Component } from '@angular/core';
import { environment } from './../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, Profile } from '../../_services/authentication/authentication.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
    signInLink: string;

    // eslint-disable-next-line no-unused-vars
    constructor(private route: ActivatedRoute, private router: Router, private authentication: AuthenticationService) {
        this.signInLink = `${environment.apiUrl}/v1/auth/google`;
        const profile = this.route.snapshot.data['profile'] as Profile | undefined;
        if (profile) {
            this.authentication.profile = profile;
            const redirectUrl = profile.isAdmin ? '/admin' : '/client';
            this.router.navigateByUrl(redirectUrl).then(() => {});
        }
    }
}
