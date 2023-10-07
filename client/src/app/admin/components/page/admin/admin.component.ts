import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DateService } from '../../../../shared/services/date.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Appointment } from '../admin-appointments/admin-appointments.service';
import { AppointmentsListComponent } from '../../../../shared/components/page/appointments-list/appointments-list.component';
import { AppointmentsWrapperComponent } from '../../../../shared/components/page/appointments-wrapper/appointments-wrapper.component';
import { AppointmentPreviewComponent } from '../../../../shared/components/ui/appointment-preview/appointment-preview.component';
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
    constructor(private readonly date: DateService, private readonly route: ActivatedRoute) {}

    get appointments(): Appointment[] {
        return this.route.snapshot.data['appointments'];
    }

    get currentDay(): Date {
        return this.date.currentDay;
    }
}
