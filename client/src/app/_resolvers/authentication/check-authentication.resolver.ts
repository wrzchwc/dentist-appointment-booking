import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthenticationService, Profile } from '../../_services/authentication/authentication.service';
import { catchError, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CheckAuthenticationResolver implements Resolve<Profile | undefined> {
    // eslint-disable-next-line no-unused-vars
    constructor(private router: Router, private authentication: AuthenticationService) {}

    // eslint-disable-next-line no-unused-vars
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.authentication.getProfile().pipe(
            catchError(() => {
                return of(undefined);
            })
        );
    }
}
