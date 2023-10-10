import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'cancelable',
    standalone: true,
})
export class CancelablePipe implements PipeTransform {
    transform(value: Date): boolean {
        return new Date() < new Date(value);
    }
}
