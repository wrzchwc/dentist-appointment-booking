import { Component, Input, OnChanges } from '@angular/core';
import { Service } from 'src/app/shared/_services/appointments/services.service';
import { TooltipService } from './tooltip.service';

@Component({
    selector: 'app-service-card',
    templateUrl: './service-card.component.html',
    styleUrls: ['./service-card.component.scss'],
})
export class ServiceCardComponent implements OnChanges {
    @Input() service?: Service;
    tooltip: string;

    // eslint-disable-next-line no-unused-vars
    constructor(private tooltipService: TooltipService) {
        this.tooltip = '';
    }

    ngOnChanges() {
        this.tooltip = this.tooltipService.getTooltip(this.service?.detail);
    }
}
