import { Component, Input, OnChanges } from '@angular/core';
import { Service } from 'src/app/shared/_services/appointments/services.service';
import { TooltipService } from './tooltip.service';
import { AppointmentsService } from '../../shared/_services/appointments/appointments.service';
import { AppointmentCartService } from '../_services/appointment-cart/appointment-cart.service';

@Component({
    selector: 'app-service-card',
    templateUrl: './service-card.component.html',
    styleUrls: ['./service-card.component.scss'],
})
export class ServiceCardComponent implements OnChanges {
    @Input() service?: Service;
    tooltip: string;

    constructor(
        private tooltipService: TooltipService,
        // eslint-disable-next-line no-unused-vars
        private appointments: AppointmentsService,
        // eslint-disable-next-line no-unused-vars
        public cart: AppointmentCartService
    ) {
        this.tooltip = tooltipService.getTooltip(this.service?.detail);
    }

    ngOnChanges() {
        this.tooltip = this.tooltipService.getTooltip(this.service?.detail);
    }

    handleRemoveServiceClick() {
        this.appointments.removeServiceFromAppointment(this.service!.id).subscribe(() => {
            this.cart.remove(this.service!);
        });
    }

    handleAddServiceClick() {
        this.appointments.addServiceToAppointment(this.service!.id).subscribe(() => {
            this.cart.add(this.service!);
        });
    }
}
