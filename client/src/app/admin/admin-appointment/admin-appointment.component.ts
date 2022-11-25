import { Component, OnDestroy } from '@angular/core';
import { AdminAppointmentService, Appointment } from './admin-appointment.service';
import { NamedPriceItem } from '../../shared/table/services-table.component';
import { ActivatedRoute } from '@angular/router';
import { PriceService } from '../../shared/_services/utility/price.service';
import { Subject, takeUntil } from 'rxjs';
import { AppointmentService } from '../../shared/appointment/appointment.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-admin-appointment',
    templateUrl: './admin-appointment.component.html',
    styleUrls: ['./admin-appointment.component.scss', '../../shared/appointment/appointment.scss'],
})
export class AdminAppointmentComponent implements OnDestroy {
    readonly appointment: Appointment;
    readonly price: number;
    readonly cancelable: boolean;
    readonly length: number;
    readonly endsAt: Date;
    readonly dataSource: NamedPriceItem[];
    readonly emailHref;
    private readonly onDestroy: Subject<void>;

    constructor(
        private activatedRoute: ActivatedRoute,
        private priceService: PriceService,
        private appointmentService: AppointmentService,
        // eslint-disable-next-line no-unused-vars
        private adminAppointmentService: AdminAppointmentService,
        // eslint-disable-next-line no-unused-vars
        private location: Location
    ) {
        this.appointment = activatedRoute.snapshot.data['appointment'];
        this.dataSource = appointmentService.createDateSource(this.appointment.services);
        this.price = priceService.calculateTotalPrice(this.dataSource);
        this.length = appointmentService.calculateLength(this.appointment.services);
        this.cancelable = appointmentService.isCancelable(this.appointment.startsAt);
        this.endsAt = appointmentService.calculateEndsAt(this.appointment.startsAt, this.length);
        this.onDestroy = new Subject<void>();
        this.emailHref = `mailto:${this.appointment.user.email}`;
    }

    ngOnDestroy(): void {
        this.onDestroy.next();
    }

    handleCancel() {
        this.adminAppointmentService
            .cancelAppointment(this.appointment.id)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(() => {
                this.location.back();
            });
    }
}
