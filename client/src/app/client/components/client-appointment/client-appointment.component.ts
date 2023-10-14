import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientAppointmentService } from './client-appointment.service';
import { Subject, takeUntil } from 'rxjs';
import { DatePipe, Location, NgIf } from '@angular/common';
import { DataService } from '../../../appointment-preview/components/appointment-preview/data.service';
import { Appointment } from '../../model';
import {
    AppointmentComponent,
    CardComponent,
    ServicesTableComponent,
    PricePipe,
    NamedPriceItem,
} from '../../../shared';
import { EndDatePipe } from '../../../appointment-preview/components/appointment-preview/end-date.pipe';

@Component({
    selector: 'app-client-appointment',
    templateUrl: './client-appointment.component.html',
    styleUrls: ['../../../shared/components/page/appointment/appointment.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgIf, AppointmentComponent, CardComponent, ServicesTableComponent, DatePipe, PricePipe, EndDatePipe],
    standalone: true,
})
export class ClientAppointmentComponent implements OnDestroy {
    readonly appointment: Appointment = this.activatedRoute.snapshot.data['appointment'];
    readonly dataSource: NamedPriceItem[] = this.appointmentService.createDateSource(this.appointment.services);
    readonly length: number = this.appointmentService.calculateLength(this.appointment.services);

    private readonly destroy$: Subject<void> = new Subject();

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly clientAppointmentService: ClientAppointmentService,
        private readonly location: Location,
        private readonly appointmentService: DataService
    ) {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    handleCancel() {
        this.clientAppointmentService
            .cancelAppointment(this.appointment.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.location.back();
            });
    }
}
