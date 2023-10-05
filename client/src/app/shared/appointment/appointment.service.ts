import { Injectable } from '@angular/core';
import { LengthItem, LengthService } from '../_services/utility/length.service';
import { DateService } from '../_services/utility/date.service';
import { AssociatedService, NamedPriceItem } from '../model';

@Injectable({
    providedIn: 'root',
})
export class AppointmentService {
    constructor(private readonly lengthService: LengthService, private readonly dateService: DateService) {}

    createDateSource(services: AssociatedService[]): NamedPriceItem[] {
        return services.map((service) => ({
            quantity: service.appointmentServices.quantity,
            detail: service.detail,
            name: service.name,
            price: service.price,
        }));
    }

    calculateLength(services: AssociatedService[]): number {
        return this.lengthService.calculateTotalLength(this.mapServicesToLengthItems(services));
    }

    isCancelable(startsAt: Date): boolean {
        return this.dateService.currentDay < new Date(startsAt);
    }

    calculateEndsAt(startsAt: Date, length: number): Date {
        const copy = new Date(startsAt);
        return new Date(copy.setMinutes(copy.getMinutes() + length));
    }

    private mapServicesToLengthItems(services: AssociatedService[]): LengthItem[] {
        return services.map((service) => ({
            quantity: service.appointmentServices.quantity,
            length: service.length,
        }));
    }
}
