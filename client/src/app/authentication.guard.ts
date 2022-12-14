import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { AuthenticationService } from './shared/_services/authentication/authentication.service';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationGuard implements CanLoad {
    // eslint-disable-next-line no-unused-vars
    constructor(private authentication: AuthenticationService, private router: Router) {}
    async canLoad(): Promise<boolean> {
        if (!this.authentication.authenticated$.value) {
            await this.router.navigateByUrl('/');
            return false;
        }
        return true;
    }
}
