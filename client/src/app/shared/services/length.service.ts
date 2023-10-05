import { Injectable } from '@angular/core';

export interface LengthItem {
    quantity: number;
    length: number;
}

@Injectable({
    providedIn: 'root',
})
export class LengthService {
    // Returns sum of lengths in minutes
    calculateTotalLength(items: LengthItem[]): number {
        return items.reduce((sum, { quantity, length }) => sum + quantity * length, 0);
    }
}
