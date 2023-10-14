import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientAppointmentsService } from './client-appointments.service';
import { Subject, takeUntil } from 'rxjs';
import { Appointment } from '../../model';
import { AppointmentsComponent } from '../../../shared/components/page/appointments/appointments.component';

@Component({
    selector: 'app-client-appointments',
    templateUrl: './client-appointments.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AppointmentsComponent],
    standalone: true,
})
export class ClientAppointmentsComponent implements OnDestroy {
    private _appointments: Appointment[] = this.activatedRoute.snapshot.data['appointments'];
    get appointments(): Appointment[] {
        return this._appointments;
    }

    private readonly destroy$: Subject<void> = new Subject();

    constructor(
        private readonly clientAppointmentsService: ClientAppointmentsService,
        private readonly activatedRoute: ActivatedRoute
    ) {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    handleDateChange(date: Date): void {
        this.clientAppointmentsService
            .getAppointments(date)
            .pipe(takeUntil(this.destroy$))
            .subscribe((appointments) => {
                this._appointments = appointments;
            });
    }
}
