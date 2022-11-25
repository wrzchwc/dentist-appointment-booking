import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Service } from '../../shared/_services/services.service';
import { TooltipService } from '../../shared/_services/tooltip.service';

@Component({
    selector: 'app-price-list',
    templateUrl: './price-list.component.html',
    styleUrls: ['./price-list.component.scss'],
})
export class PriceListComponent {
    services: Service[];

    // eslint-disable-next-line no-unused-vars
    constructor(private route: ActivatedRoute, public tooltipService: TooltipService) {
        this.services = route.snapshot.data['services'];
    }
}
