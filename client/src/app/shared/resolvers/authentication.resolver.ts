import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { catchError, Observable, of, tap } from 'rxjs';
import { Profile } from '../model';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationResolver implements Resolve<Profile | undefined> {
    constructor(private readonly router: Router, private readonly authentication: AuthenticationService) {}

    resolve(): Observable<Profile | undefined> {
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

    private redirect(): void {
        this.router.navigateByUrl(this.authentication.profile?.isAdmin ? '/admin' : '/client').then();
    }
}
