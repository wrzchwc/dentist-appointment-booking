import { Pipe, PipeTransform } from '@angular/core';
import { PriceItem } from '../model';

@Pipe({
    name: 'price',
    standalone: true,
})
export class PricePipe implements PipeTransform {
    transform(items: PriceItem[]): number {
        return items.reduce((sum, item) => sum + this.calculatePrice(item), 0);
    }

    private calculatePrice({ price, quantity, detail }: PriceItem): number {
        if (price) {
            return price * quantity;
        } else if (detail === 'A') {
            return this.calculateExceptionalPrice(quantity);
        } else if (detail === 'B') {
            return 170 + 30 * (quantity - 1);
        }
        return 0;
    }

    private calculateExceptionalPrice(quantity: number): number {
        if (quantity < 1) {
            return 0;
        } else if (quantity === 1) {
            return 170;
        }
        return 300 + 50 * (quantity - 3);
    }
}
