import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { AuthenticationService } from './shared/_services/authentication/authentication.service';
import { catchError, of, tap } from 'rxjs';
import { Profile } from './shared/shared.model';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationResolver implements Resolve<Profile | undefined> {
    // eslint-disable-next-line no-unused-vars
    constructor(private router: Router, private authentication: AuthenticationService) {}

    resolve() {
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
