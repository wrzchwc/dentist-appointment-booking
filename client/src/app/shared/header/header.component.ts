import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthenticationService } from '../_services/authentication/authentication.service';
import { environment } from '../../../environments/environment';
import { AsyncPipe, NgClass, NgIf, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { Profile } from '../shared.model';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [NgClass, RouterLink, NgIf, MatIconModule, AsyncPipe, MatButtonModule, NgOptimizedImage],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
    private readonly _signOutUrl: string = `${environment.apiUrl}/api/auth/sign-out`;
    get signOutUrl(): string {
        return this._signOutUrl;
    }

    private readonly _logoUrl: string = this.getLogoUrl();
    get logoUrl(): string {
        return this._logoUrl;
    }

    get authenticated$(): Observable<boolean> {
        return this.authenticationService.authenticated$;
    }

    get profile(): Profile | undefined {
        return this.authenticationService.profile;
    }

    constructor(private readonly authenticationService: AuthenticationService) {}

    private getLogoUrl(): string {
        if (!this.authenticationService.authenticated$.value) {
            return '/';
        }
        return this.authenticationService.profile?.isAdmin ? '/admin' : '/client';
    }
}
