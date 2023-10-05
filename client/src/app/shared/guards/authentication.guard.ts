import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationGuard implements CanLoad {
    constructor(private readonly authentication: AuthenticationService, private readonly router: Router) {}

    async canLoad(): Promise<boolean> {
        if (!this.authentication.authenticated$.value) {
            await this.router.navigateByUrl('/');
            return false;
        }
        return true;
    }
}
