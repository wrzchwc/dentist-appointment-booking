import { Injectable } from '@angular/core';
import { Service } from './services.service';

export type ServiceItem = Service & { quantity: number };

@Injectable({
    providedIn: 'root',
})
export class LengthService {
    constructor() {}

    calculateTotalLength(items: ServiceItem[]): number {
        return items.reduce((sum, { quantity, length }) => sum + quantity * length, 0);
    }
}
