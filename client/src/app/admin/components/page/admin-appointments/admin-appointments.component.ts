import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { AdminAppointmentsService } from './admin-appointments.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AppointmentsComponent } from '../../../../shared/components/page/appointments/appointments.component';
import { AdminAppointmentPreview } from '../../../../shared';

@Component({
    selector: 'app-admin-appointments',
    templateUrl: './admin-appointments.component.html',
    styleUrls: ['./admin-appointments.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AppointmentsComponent],
    standalone: true,
})
export class AdminAppointmentsComponent implements OnDestroy {
    appointments: AdminAppointmentPreview[] = this.route.snapshot.data['appointments'];

    private readonly destroy$: Subject<void> = new Subject();

    constructor(private readonly route: ActivatedRoute, private readonly service: AdminAppointmentsService) {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadAppointmentsAt(date: Date) {
        this.service
            .getAppointments(date)
            .pipe(takeUntil(this.destroy$))
            .subscribe((appointments) => {
                this.appointments = appointments;
            });
    }
}
