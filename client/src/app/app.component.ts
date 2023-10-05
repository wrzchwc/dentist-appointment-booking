import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthenticationService } from './shared/services/authentication.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    constructor(private readonly auth: AuthenticationService) {}

    get authenticated$(): Observable<boolean> {
        return this.auth.authenticated$;
    }
}
