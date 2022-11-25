import { Pipe, PipeTransform } from '@angular/core';
import { Service } from 'src/app/shared/_services/services.service';

@Pipe({
    name: 'appointmentTimes',
})
export class AppointmentTimesPipe implements PipeTransform {
    transform({ count, length }: Service, unit: string): string {
        if (count < 1) {
            throw new Error('Incorrect count value!');
        }

        return count === 1 ? `${length} ${unit}` : `${count} X ${length} ${unit}`;
    }
}
