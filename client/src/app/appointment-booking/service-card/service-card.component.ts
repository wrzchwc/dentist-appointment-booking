import { Component, Input, OnChanges } from '@angular/core';
import { Service } from 'src/app/shared/_services/appointments/services.service';
import { TooltipService } from './tooltip.service';
import { AppointmentCartService } from '../_services/appointment-cart/appointment-cart.service';

@Component({
    selector: 'app-service-card',
    templateUrl: './service-card.component.html',
    styleUrls: ['./service-card.component.scss'],
})
export class ServiceCardComponent implements OnChanges {
    @Input() service?: Service;
    tooltip: string;

    // eslint-disable-next-line no-unused-vars
    constructor(private tooltipService: TooltipService, public cart: AppointmentCartService) {
        this.tooltip = tooltipService.getTooltip(this.service?.detail);
    }

    ngOnChanges() {
        this.tooltip = this.tooltipService.getTooltip(this.service?.detail);
    }

    handleRemoveServiceClick() {
        if (this.service) {
            this.cart.remove(this.service);
        }
    }

    handleAddServiceClick() {
        if (this.service) {
            this.cart.add(this.service);
        }
    }
}
