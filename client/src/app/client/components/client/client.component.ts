import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppointmentsListComponent } from '../../../shared/components/page/appointments-list/appointments-list.component';
import { NgForOf, NgIf } from '@angular/common';
import { AppointmentsWrapperComponent } from '../../../shared/components/page/appointments-wrapper/appointments-wrapper.component';
import { Appointment1, AppointmentPreviewComponent, AuthenticationService } from '../../../shared';

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

    get appointments(): Appointment1[] {
        return this.route.snapshot.data['appointments'];
    }

    get name(): string | undefined {
        return this.authenticationService.profile?.name;
    }
}
