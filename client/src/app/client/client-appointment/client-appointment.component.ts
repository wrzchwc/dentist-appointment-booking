import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Appointment, AssociatedService } from '../client-appointments/client-appointments.service';
import { PriceItem, PriceService } from '../../shared/_services/utility/price.service';
import { DateService } from '../../shared/_services/utility/date.service';
import { LengthItem, LengthService } from '../../shared/_services/utility/length.service';

@Component({
    selector: 'app-client-appointment',
    templateUrl: './client-appointment.component.html',
    styleUrls: ['./client-appointment.component.scss'],
})
export class ClientAppointmentComponent {
    readonly appointment: Appointment;
    readonly price: number;
    readonly cancelable: boolean;
    readonly length: number;
    readonly endsAt: Date;

    constructor(
        private activatedRoute: ActivatedRoute,
        private priceService: PriceService,
        private dateService: DateService,
        private lengthService: LengthService
    ) {
        this.appointment = activatedRoute.snapshot.data['appointment'];
        this.cancelable = true;
        this.price = priceService.calculateTotalPrice(this.appointment.services.map(this.mapServiceToPriceItem));
        this.cancelable = dateService.currentDay < new Date(this.appointment.startsAt);
        this.length = lengthService.calculateTotalLength(this.appointment.services.map(this.mapServiceToLengthItem));
        this.endsAt = new Date(new Date(this.appointment.startsAt).setMinutes(this.length));
    }

    private mapServiceToPriceItem(service: AssociatedService): PriceItem {
        return { price: service.price, quantity: service.appointmentServices.quantity, detail: service.detail };
    }

    private mapServiceToLengthItem(service: AssociatedService): LengthItem {
        return { quantity: service.appointmentServices.quantity, length: service.length };
    }
}
