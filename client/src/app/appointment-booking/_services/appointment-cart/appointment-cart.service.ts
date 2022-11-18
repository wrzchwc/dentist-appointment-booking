import { Injectable } from '@angular/core';
import { Service } from 'src/app/shared/_services/appointments/services.service';
import { BehaviorSubject } from 'rxjs';
import { PriceItem } from 'src/app/shared/_services/appointments/price.service';
import { ServiceItem } from 'src/app/shared/_services/appointments/length.service';

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

    get valid(): boolean {
        return Boolean(this.getCartValuesWithPositiveSubjectValue().find(([, service]) => service));
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

    getPriceItems(): PriceItem[] {
        return this.getCartValuesWithPositiveSubjectValue().map(this.mapToPriceItem);
    }

    private mapToPriceItem([{ value }, { price, detail, name }]: [BehaviorSubject<number>, Service]): PriceItem {
        return { quantity: value, price, detail, name };
    }

    getServiceItems(): ServiceItem[] {
        return this.getCartValuesWithPositiveSubjectValue().map(this.mapToLengthItem);
    }

    private getCartValuesWithPositiveSubjectValue(): Array<[BehaviorSubject<number>, Service]> {
        return Array.from(this.cart.values()).filter(this.filterForPositiveSubjectValue);
    }

    private filterForPositiveSubjectValue([{ value }]: [BehaviorSubject<number>, Service]): boolean {
        return value > 0;
    }

    private mapToLengthItem([{ value }, service]: [BehaviorSubject<number>, Service]): ServiceItem {
        return { ...service, quantity: value };
    }
}
