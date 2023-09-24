import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Appointment } from '../../admin/admin-appointments/admin-appointments.service';
import { MatCardModule } from '@angular/material/card';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-appointment-preview',
    templateUrl: './appointment-preview.component.html',
    styleUrls: ['./appointment-preview.component.scss'],
    imports: [MatCardModule, NgIf, MatIconModule, MatChipsModule, RouterLink, NgForOf, MatButtonModule, DatePipe],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentPreviewComponent implements OnChanges {
    @Input() appointment?: Partial<Appointment>;

    private _services: string[] = [];
    get services(): string[] {
        return this._services;
    }

    private _link: string = '';
    get link(): string {
        return this._link;
    }

    constructor(private readonly router: Router) {}

    ngOnChanges(): void {
        if (this.appointment !== undefined) {
            this._services = this.appointment.services?.map((service) => service.name) || [];
            const [role] = this.router.url.split('/').filter(Boolean);
            this._link = `/${role}/appointments/${this.appointment.id}`;
        }
    }
}
