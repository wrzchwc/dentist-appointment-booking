import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Appointment, AssociatedService } from '../client-appointments/client-appointments.service';
import { PriceService } from '../../shared/_services/utility/price.service';
import { DateService } from '../../shared/_services/utility/date.service';
import { LengthItem, LengthService } from '../../shared/_services/utility/length.service';
import { NamedPriceItem } from '../../shared/table/services-table.component';
import { ClientAppointmentService } from './client-appointment.service';
import { Subject, takeUntil } from 'rxjs';
import { Location } from '@angular/common';

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
        private dateService: DateService,
        private lengthService: LengthService,
        // eslint-disable-next-line no-unused-vars
        private clientAppointmentService: ClientAppointmentService,
        // eslint-disable-next-line no-unused-vars
        private location: Location
    ) {
        this.appointment = activatedRoute.snapshot.data['appointment'];
        this.dataSource = this.mapServicesToPriceItems();
        this.price = priceService.calculateTotalPrice(this.dataSource);
        this.length = lengthService.calculateTotalLength(this.mapServicesToLengthItems());
        this.cancelable = dateService.currentDay < new Date(this.appointment.startsAt);
        this.endsAt = this.calculateEndsAt();
        this.onDestroy = new Subject<void>();
    }

    ngOnDestroy(): void {
        this.onDestroy.next();
    }

    handleCancelClick() {
        this.clientAppointmentService
            .cancelAppointment(this.appointment.id)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(() => {
                this.location.back();
            });
    }

    private mapServicesToPriceItems(): NamedPriceItem[] {
        return this.appointment.services.map(this.mapServiceToPriceItem);
    }

    private mapServiceToPriceItem({ price, appointmentServices, detail, name }: AssociatedService): NamedPriceItem {
        return { quantity: appointmentServices.quantity, detail, name, price };
    }

    private mapServicesToLengthItems(): LengthItem[] {
        return this.appointment.services.map(this.mapServiceToLengthItem);
    }

    private mapServiceToLengthItem(service: AssociatedService): LengthItem {
        return { quantity: service.appointmentServices.quantity, length: service.length };
    }

    private calculateEndsAt(): Date {
        return new Date(new Date(this.appointment.startsAt).setMinutes(this.length));
    }
}
