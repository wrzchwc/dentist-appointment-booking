import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { AdminAppointmentService, Appointment } from './admin-appointment.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AppointmentService } from '../../../../shared/components/page/appointment/appointment.service';
import { DatePipe, Location, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { AppointmentComponent } from '../../../../shared/components/page/appointment/appointment.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { ServicesTableComponent } from '../../../../shared/components/ui/services-table/services-table.component';
import { NamedPriceItem, PricePipe } from '../../../../shared';
import { EmailPipe } from './email.pipe';
import { EndDatePipe } from '../../../../shared/pipes/end-date.pipe';

@Component({
    selector: 'app-admin-appointment',
    templateUrl: './admin-appointment.component.html',
    styleUrls: ['./admin-appointment.component.scss', '../../../../shared/components/page/appointment/appointment.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        AppointmentComponent,
        NgIf,
        CardComponent,
        ServicesTableComponent,
        DatePipe,
        NgOptimizedImage,
        NgForOf,
        PricePipe,
        EmailPipe,
        EndDatePipe,
    ],
    standalone: true,
})
export class AdminAppointmentComponent implements OnDestroy {
    readonly appointment: Appointment = this.activatedRoute.snapshot.data['appointment'];
    readonly dataSource: NamedPriceItem[] = this.appointmentService.createDateSource(this.appointment.services);
    readonly length: number = this.appointmentService.calculateLength(this.appointment.services);

    private readonly destroy$: Subject<void> = new Subject();

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly appointmentService: AppointmentService,
        private readonly adminAppointmentService: AdminAppointmentService,
        private readonly location: Location,
    ) {
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    handleCancel(): void {
        this.adminAppointmentService
            .cancelAppointment(this.appointment.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.location.back();
            });
    }
}
