import { Injectable } from '@angular/core';
import { LengthService } from '../../../services/length.service';
import { AssociatedService, NamedPriceItem } from '../../../model';

@Injectable({
    providedIn: 'root',
})
export class AppointmentService {
    constructor(private readonly lengthService: LengthService) {
    }

    createDateSource(services: AssociatedService[]): NamedPriceItem[] {
        return services.map((service) => ({
            quantity: service.appointmentServices.quantity,
            detail: service.detail,
            name: service.name,
            price: service.price,
        }));
    }

    calculateLength(services: AssociatedService[]): number {
        return this.lengthService.calculateTotalLength(services.map((service) => ({
                    quantity: service.appointmentServices.quantity,
                    length: service.length,
                }
            ),
        ));
    }
}
