import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { TooltipService } from '../../shared/_services/tooltip.service';
import { AppointmentCartService } from '../appointment-cart.service';
import { Service } from '../../shared/shared.model';

@Component({
    selector: 'app-service-card',
    templateUrl: './service-card.component.html',
    styleUrls: ['./service-card.component.scss'],
})
export class ServiceCardComponent implements OnChanges {
    @Input() service?: Service;
    @Output() serviceChange: EventEmitter<void>;
    tooltip: string;

    // eslint-disable-next-line no-unused-vars
    constructor(private tooltipService: TooltipService, public cart: AppointmentCartService) {
        this.tooltip = tooltipService.getTooltip(this.service?.detail);
        this.serviceChange = new EventEmitter<void>();
    }

    ngOnChanges() {
        this.tooltip = this.tooltipService.getTooltip(this.service?.detail);
    }

    handleRemoveServiceClick() {
        if (this.service) {
            this.cart.remove(this.service);
            this.serviceChange.emit();
        }
    }

    handleAddServiceClick() {
        if (this.service) {
            this.cart.add(this.service);
            this.serviceChange.emit();
        }
    }
}
