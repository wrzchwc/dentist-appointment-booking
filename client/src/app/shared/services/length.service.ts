import { Injectable } from '@angular/core';
import { LengthItem } from '../model';

@Injectable({
    providedIn: 'root',
})
export class LengthService {
    // Returns sum of lengths in minutes
    calculateTotalLength(items: LengthItem[]): number {
        return items.reduce((sum, { quantity, length }) => sum + quantity * length, 0);
    }
}
