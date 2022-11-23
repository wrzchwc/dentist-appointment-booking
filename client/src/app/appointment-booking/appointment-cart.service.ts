import { Injectable } from '@angular/core';
import { Service } from 'src/app/shared/_services/services.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { LengthItem } from 'src/app/shared/_services/utility/length.service';
import { NamedPriceItem } from '../shared/_services/utility/price.service';

@Injectable({
    providedIn: 'root',
})
export class AppointmentCartService {
    readonly change$: Subject<void>;
    private readonly cart: Map<string, [BehaviorSubject<number>, Service]>;

    constructor() {
        this.cart = new Map<string, [BehaviorSubject<number>, Service]>();
        this.change$ = new Subject<void>();
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

        if (entry) {
            const quantity = entry[0];
            quantity.next(quantity.value + 1);
            this.change$.next();
        } else {
            throw new Error('Appointment Cart Error');
        }
    }

    remove(service: Service) {
        const entry = this.cart.get(service.id);

        if (entry) {
            const quantity = entry[0];
            quantity.next(quantity.value === 1 ? 0 : quantity.value - 1);
            this.change$.next();
        } else {
            throw new Error('Appointment Cart Error');
        }
    }

    getPriceItems(): NamedPriceItem[] {
        return this.getCartValuesWithPositiveSubjectValue().map(this.mapToPriceItem);
    }

    private mapToPriceItem([{ value }, { price, detail, name }]: [BehaviorSubject<number>, Service]): NamedPriceItem {
        return { quantity: value, price, detail, name };
    }

    getLengthItems(): LengthItem[] {
        return this.getCartValuesWithPositiveSubjectValue().map(this.mapToLengthItem);
    }

    private getCartValuesWithPositiveSubjectValue(): Array<[BehaviorSubject<number>, Service]> {
        return Array.from(this.cart.values()).filter(this.filterForPositiveSubjectValue);
    }

    private filterForPositiveSubjectValue([{ value }]: [BehaviorSubject<number>, Service]): boolean {
        return value > 0;
    }

    private mapToLengthItem([{ value }, { length }]: [BehaviorSubject<number>, Service]): LengthItem {
        return { length, quantity: value };
    }

    getIdQuantityObjects(): IdQuantity[] {
        return this.getCartValuesWithPositiveSubjectValue().map(this.mapToIdQuantityObject);
    }

    private mapToIdQuantityObject([{ value }, { id }]: [BehaviorSubject<number>, Service]): IdQuantity {
        return { id, quantity: value };
    }
}

export interface IdQuantity {
    id: string;
    quantity: number;
}
