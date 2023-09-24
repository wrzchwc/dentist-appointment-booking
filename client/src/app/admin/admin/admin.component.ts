import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DateService } from '../../shared/_services/utility/date.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Appointment } from '../admin-appointments/admin-appointments.service';
import { AppointmentsListComponent } from '../../shared/appointments-list/appointments-list.component';
import { AppointmentsWrapperComponent } from '../../shared/appointments-wrapper/appointments-wrapper.component';
import { AppointmentPreviewComponent } from '../../shared/appointment-preview/appointment-preview.component';
import { DatePipe, NgForOf, NgIf } from '@angular/common';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
    imports: [
        AppointmentsListComponent,
        AppointmentsWrapperComponent,
        AppointmentPreviewComponent,
        NgIf,
        NgForOf,
        DatePipe,
        RouterLink,
    ],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
    get appointments(): Appointment[] {
        return this.route.snapshot.data['appointments'];
    }

    constructor(public readonly date: DateService, public readonly route: ActivatedRoute) {}
}
