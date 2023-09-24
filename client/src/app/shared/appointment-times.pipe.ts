import { Pipe, PipeTransform } from '@angular/core';
import { Service } from 'src/app/shared/_services/services.service';

@Pipe({
    name: 'appointmentTimes',
    standalone: true,
})
export class AppointmentTimesPipe implements PipeTransform {
    transform(service: Service, unit: string): string {
        if (service.count < 1) {
            throw new Error('Incorrect count value!');
        }

        return service.count === 1 ? `${service.length} ${unit}` : `${service.count} X ${service.length} ${unit}`;
    }
}
