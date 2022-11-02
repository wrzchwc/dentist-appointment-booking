import { Pipe, PipeTransform } from '@angular/core';
import { Service } from 'src/app/shared/_services/appointments/services.service';

@Pipe({
    name: 'appointmentTimes',
})
export class AppointmentTimesPipe implements PipeTransform {
    transform({ count, detail, length }: Service, unit: string): string {
        if (count < 1) {
            throw new Error('Incorrect count value!');
        }
        if (detail === 'C') {
            return `45 ${unit} + 35 ${unit}`;
        }

        return count === 1 ? `${length} ${unit}` : `${count} X ${length} ${unit}`;
    }
}
