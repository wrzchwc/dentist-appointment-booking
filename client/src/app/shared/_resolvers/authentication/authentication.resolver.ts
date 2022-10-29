import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthenticationService, Profile } from '../../_services/authentication/authentication.service';
import { catchError, of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationResolver implements Resolve<Profile | undefined> {
    // eslint-disable-next-line no-unused-vars
    constructor(private router: Router, private authentication: AuthenticationService) {}

    // eslint-disable-next-line no-unused-vars
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authentication.profile) {
            this.redirect();
            return of(this.authentication.profile);
        }

        return this.authentication.getProfile().pipe(
            tap((profile) => {
                this.authentication.profile = profile;
                this.authentication.authenticated$.next(true);
                this.redirect();
            }),
            catchError(() => of(undefined))
        );
    }

    private redirect() {
        this.router.navigateByUrl(this.authentication.profile?.isAdmin ? '/admin' : '/client').then();
    }
}
