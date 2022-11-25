import { Injectable } from '@angular/core';
import { AssociatedService } from '../../client/client-appointments/client-appointments.service';
import { NamedPriceItem } from '../table/services-table.component';
import { LengthItem, LengthService } from '../_services/utility/length.service';
import { DateService } from '../_services/utility/date.service';

@Injectable({
    providedIn: 'root',
})
export class AppointmentService {
    // eslint-disable-next-line no-unused-vars
    constructor(private length: LengthService, private date: DateService) {}

    createDateSource(services: AssociatedService[]): NamedPriceItem[] {
        return services.map(this.mapServiceToPriceItem);
    }

    calculateLength(services: AssociatedService[]): number {
        return this.length.calculateTotalLength(this.mapServicesToLengthItems(services));
    }

    isCancelable(startsAt: Date): boolean {
        return this.date.currentDay < new Date(startsAt);
    }

    calculateEndsAt(startsAt: Date, length: number): Date {
        return new Date(new Date(startsAt).setMinutes(length));
    }

    private mapServiceToPriceItem({ price, appointmentServices, detail, name }: AssociatedService): NamedPriceItem {
        return { quantity: appointmentServices.quantity, detail, name, price };
    }

    private mapServicesToLengthItems(services: AssociatedService[]): LengthItem[] {
        return services.map(this.mapServiceToLengthItem);
    }

    private mapServiceToLengthItem(service: AssociatedService): LengthItem {
        return { quantity: service.appointmentServices.quantity, length: service.length };
    }
}
