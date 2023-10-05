import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { AdminAppointmentsService, Appointment } from './admin-appointments.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AppointmentsComponent } from '../../shared/components/page/appointments/appointments.component';

@Component({
    selector: 'app-admin-appointments',
    templateUrl: './admin-appointments.component.html',
    styleUrls: ['./admin-appointments.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AppointmentsComponent],
    standalone: true,
})
export class AdminAppointmentsComponent implements OnInit, OnDestroy {
    appointments: Appointment[] = [];

    private readonly destroy$ = new Subject<void>();

    constructor(private route: ActivatedRoute, private service: AdminAppointmentsService) {}

    ngOnInit(): void {
        this.appointments = this.route.snapshot.data['appointments'];
    }

    ngOnDestroy(): void {
        this.destroy$.next();
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
