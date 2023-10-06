import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { LengthItem } from 'src/app/shared/services/length.service';
import { NamedPriceItem, Service } from '../shared/model';
import { Quantity } from './model';

@Injectable({
    providedIn: 'root',
})
export class AppointmentCartService {
    readonly change$: Subject<void> = new Subject();

    private readonly cart: Map<string, [BehaviorSubject<number>, Service]> = new Map();

    initialize(services: Service[]): void {
        services.forEach((service) => {
            this.cart.set(service.id, [new BehaviorSubject<number>(0), service]);
        });
    }

    get valid(): boolean {
        return !!this.cartValuesWithPositiveSubjectValue.find(([, service]) => service);
    }

    get priceItems(): NamedPriceItem[] {
        return this.cartValuesWithPositiveSubjectValue.map(([{ value }, { price, detail, name }]) => ({
            quantity: value,
            price,
            detail,
            name,
        }));
    }

    get lengthItems(): LengthItem[] {
        return this.cartValuesWithPositiveSubjectValue.map(([{ value }, { length }]) => ({
            length,
            quantity: value,
        }));
    }

    get quantities(): Quantity[] {
        return this.cartValuesWithPositiveSubjectValue.map(([{ value }, { id }]) => ({ id, quantity: value }));
    }

    quantityOf(service: Service): BehaviorSubject<number> {
        return this.cart.get(service.id)?.at(0) as BehaviorSubject<number>;
    }

    add(service: Service): void {
        const entry = this.cart.get(service.id);

        if (entry) {
            const quantity = entry[0];
            quantity.next(quantity.value + 1);
            this.change$.next();
        } else {
            throw new Error('Appointment Cart Error');
        }
    }

    remove(service: Service): void {
        const entry = this.cart.get(service.id);

        if (entry) {
            const quantity = entry[0];
            quantity.next(quantity.value === 1 ? 0 : quantity.value - 1);
            this.change$.next();
        } else {
            throw new Error('Appointment Cart Error');
        }
    }

    private get cartValuesWithPositiveSubjectValue(): Array<[BehaviorSubject<number>, Service]> {
        return Array.from(this.cart.values()).filter(([{ value }]) => value > 0);
    }
}
