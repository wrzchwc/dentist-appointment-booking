import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { AppointmentsListComponent } from '../../shared/components/page/appointments-list/appointments-list.component';
import { NgForOf, NgIf } from '@angular/common';
import { AppointmentsWrapperComponent } from '../../shared/components/page/appointments-wrapper/appointments-wrapper.component';
import { AppointmentPreviewComponent } from '../../shared/components/ui/appointment-preview/appointment-preview.component';
import { Appointment } from '../../admin/admin-appointment/admin-appointment.service';

@Component({
    selector: 'app-client',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AppointmentsListComponent, NgIf, AppointmentsWrapperComponent, AppointmentPreviewComponent, NgForOf],
    standalone: true,
})
export class ClientComponent {
    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly route: ActivatedRoute
    ) {}

    get appointments(): Appointment[] {
        return this.route.snapshot.data['appointments'];
    }

    get name(): string | undefined {
        return this.authenticationService.profile?.name;
    }
}
