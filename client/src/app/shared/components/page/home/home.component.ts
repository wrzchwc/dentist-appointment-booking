import { ChangeDetectionStrategy, Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    imports: [MatIconModule, MatButtonModule, NgOptimizedImage],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
    private readonly _signInLink: string = `${environment.apiUrl}/api/auth/google`;
    get signInLink(): string {
        return this._signInLink;
    }
}
