import { Component } from '@angular/core';
import { Appointment } from './admin-appointment.service';
import { NamedPriceItem } from '../../shared/table/services-table.component';
import { ActivatedRoute } from '@angular/router';
import { PriceService } from '../../shared/_services/utility/price.service';
import { DateService } from '../../shared/_services/utility/date.service';
import { LengthItem, LengthService } from '../../shared/_services/utility/length.service';
import { AssociatedService } from '../../client/client-appointments/client-appointments.service';

@Component({
    selector: 'app-admin-appointment',
    templateUrl: './admin-appointment.component.html',
    styleUrls: ['./admin-appointment.component.scss'],
})
export class AdminAppointmentComponent {
    readonly appointment: Appointment;
    readonly price: number;
    readonly cancelable: boolean;
    readonly length: number;
    readonly endsAt: Date;
    readonly dateSource: NamedPriceItem[];

    constructor(
        private activatedRoute: ActivatedRoute,
        private priceService: PriceService,
        private dateService: DateService,
        private lengthService: LengthService
    ) {
        this.appointment = activatedRoute.snapshot.data['appointment'];
        this.dateSource = this.mapServicesToPriceItems();
        this.price = priceService.calculateTotalPrice(this.dateSource);
        this.length = lengthService.calculateTotalLength(this.mapServicesToLengthItems());
        this.cancelable = dateService.currentDay < new Date(this.appointment.startsAt);
        this.endsAt = this.calculateEndsAt();
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

    private mapServiceToLengthItem({ appointmentServices, length }: AssociatedService): LengthItem {
        return { quantity: appointmentServices.quantity, length };
    }

    private calculateEndsAt(): Date {
        return new Date(new Date(this.appointment.startsAt).setMinutes(this.length));
    }
}
