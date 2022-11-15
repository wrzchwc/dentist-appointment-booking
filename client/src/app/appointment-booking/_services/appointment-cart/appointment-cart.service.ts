import { Injectable } from '@angular/core';
import { Service } from 'src/app/shared/_services/appointments/services.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AppointmentCartService {
    private readonly cart: Map<string, [BehaviorSubject<number>, Service]>;

    constructor() {
        this.cart = new Map<string, [BehaviorSubject<number>, Service]>();
    }

    initialize(services: Service[]) {
        services.forEach((service) => {
            this.cart.set(service.id, [new BehaviorSubject<number>(0), service]);
        });
    }

    quantityOf(service: Service) {
        return this.cart.get(service.id)?.at(0) as BehaviorSubject<number>;
    }

    add(service: Service) {
        const entry = this.cart.get(service.id);

        if (!entry) {
            throw new Error('Appointment Cart Error');
        }

        const quantity = entry[0];
        quantity.next(quantity.value + 1);
    }

    remove(service: Service) {
        const entry = this.cart.get(service.id);

        if (!entry) {
            throw new Error('Appointment Cart Error');
        }

        const quantity = entry[0];
        quantity.next(quantity.value === 1 ? 0 : quantity.value - 1);
    }
}
