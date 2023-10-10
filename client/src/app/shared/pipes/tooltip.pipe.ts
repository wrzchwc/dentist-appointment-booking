import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'tooltip',
    standalone: true,
})
export class TooltipPipe implements PipeTransform {
    transform(value: 'A' | 'B' | 'C' | null): string {
        switch (value) {
            case 'A':
                return '1 ząb: 170 PLN, 2 zęby 250 PLN, 3 zęby 300 PLN, kolejny ząb: +50 PLN';
            case 'B':
                return '1 punkt: 170 PLN, kolejny punkt: +30 PLN';
            default:
                return '';
        }
    }
}
