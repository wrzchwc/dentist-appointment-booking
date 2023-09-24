import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { AdminAppointmentService, Appointment } from './admin-appointment.service';
import { ActivatedRoute } from '@angular/router';
import { PriceService } from '../../shared/_services/utility/price.service';
import { Subject, takeUntil } from 'rxjs';
import { AppointmentService } from '../../shared/appointment/appointment.service';
import { DatePipe, Location, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { NamedPriceItem } from '../../shared/shared.model';
import { AppointmentComponent } from '../../shared/appointment/appointment.component';
import { CardComponent } from '../../shared/card/card.component';
import { ServicesTableComponent } from '../../shared/services-table/services-table.component';

@Component({
    selector: 'app-admin-appointment',
    templateUrl: './admin-appointment.component.html',
    styleUrls: ['./admin-appointment.component.scss', '../../shared/appointment/appointment.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AppointmentComponent, NgIf, CardComponent, ServicesTableComponent, DatePipe, NgOptimizedImage, NgForOf],
    standalone: true,
})
export class AdminAppointmentComponent implements OnDestroy {
    readonly appointment: Appointment;
    readonly price: number;
    readonly cancelable: boolean;
    readonly length: number;
    readonly endsAt: Date;
    readonly dataSource: NamedPriceItem[];
    readonly emailHref;
    private readonly destroy$ = new Subject<void>();

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly priceService: PriceService,
        private readonly appointmentService: AppointmentService,
        private readonly adminAppointmentService: AdminAppointmentService,
        private readonly location: Location
    ) {
        this.appointment = activatedRoute.snapshot.data['appointment'];
        this.dataSource = appointmentService.createDateSource(this.appointment.services);
        this.price = priceService.calculateTotalPrice(this.dataSource);
        this.length = appointmentService.calculateLength(this.appointment.services);
        this.cancelable = appointmentService.isCancelable(this.appointment.startsAt);
        this.endsAt = appointmentService.calculateEndsAt(this.appointment.startsAt, this.length);
        this.emailHref = `mailto:${this.appointment.user.email}`;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
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
