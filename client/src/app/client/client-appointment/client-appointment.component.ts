import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Appointment } from '../client-appointments/client-appointments.service';
import { PriceService } from '../../shared/_services/utility/price.service';
import { NamedPriceItem } from '../../shared/table/services-table.component';
import { ClientAppointmentService } from './client-appointment.service';
import { Subject, takeUntil } from 'rxjs';
import { Location } from '@angular/common';
import { AppointmentService } from '../../shared/appointment/appointment.service';

@Component({
    selector: 'app-client-appointment',
    templateUrl: './client-appointment.component.html',
    styleUrls: ['./client-appointment.component.scss'],
})
export class ClientAppointmentComponent implements OnDestroy {
    readonly appointment: Appointment;
    readonly price: number;
    readonly cancelable: boolean;
    readonly length: number;
    readonly endsAt: Date;
    readonly dataSource: NamedPriceItem[];
    private readonly onDestroy: Subject<void>;

    constructor(
        private activatedRoute: ActivatedRoute,
        private priceService: PriceService,
        // eslint-disable-next-line no-unused-vars
        private clientAppointmentService: ClientAppointmentService,
        // eslint-disable-next-line no-unused-vars
        private location: Location,
        private appointmentService: AppointmentService
    ) {
        this.appointment = activatedRoute.snapshot.data['appointment'];
        this.dataSource = appointmentService.createDateSource(this.appointment.services);
        this.price = priceService.calculateTotalPrice(this.dataSource);
        this.length = appointmentService.calculateLength(this.appointment.services);
        this.cancelable = appointmentService.isCancelable(this.appointment.startsAt);
        this.endsAt = appointmentService.calculateEndsAt(this.appointment.startsAt, length);
        this.onDestroy = new Subject<void>();
    }

    ngOnDestroy(): void {
        this.onDestroy.next();
    }

    handleCancel() {
        this.clientAppointmentService
            .cancelAppointment(this.appointment.id)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(() => {
                this.location.back();
            });
    }
}
