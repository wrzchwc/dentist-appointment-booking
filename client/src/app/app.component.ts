import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthenticationService } from './shared/services/authentication.service';
import { Observable } from 'rxjs';
import { HeaderComponent } from './shared/components/ui/header/header.component';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe, NgClass } from '@angular/common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [HeaderComponent, RouterOutlet, NgClass, AsyncPipe],
    standalone: true,
})
export class AppComponent {
    constructor(private readonly auth: AuthenticationService) {}

    get authenticated$(): Observable<boolean> {
        return this.auth.authenticated$;
    }
}
