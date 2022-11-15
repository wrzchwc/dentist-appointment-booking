import { Injectable } from '@angular/core';

export interface PriceItem {
    price: number;
    quantity: number;
    name?: string;
}

@Injectable({
    providedIn: 'root',
})
export class PriceService {
    constructor() {}

    calculateTotalPrice(items: PriceItem[]): number {
        return items.reduce((sum, { price, quantity }) => sum + price * quantity, 0);
    }
}
