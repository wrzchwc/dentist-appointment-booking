import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
    name: 'endDate',
    standalone: true,
})
export class EndDatePipe implements PipeTransform {
    transform(value: Date, length: number): Date {
        return DateTime.fromJSDate(value).plus({ minute: length }).toJSDate();
    }
}
