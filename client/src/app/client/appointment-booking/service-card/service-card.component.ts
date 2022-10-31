import { Component, Input, OnChanges } from '@angular/core';
import { Service } from 'src/app/shared/_services/appointments/services.service';

@Component({
    selector: 'app-service-card',
    templateUrl: './service-card.component.html',
    styleUrls: ['./service-card.component.scss'],
})
export class ServiceCardComponent implements OnChanges {
    @Input() service?: Service;
    tooltip: string;

    constructor() {
        this.tooltip = '';
    }

    ngOnChanges() {
        if (!this.service || this.service.detail === 'C') {
            return;
        }
        this.setTooltip(this.service.detail);
    }

    private setTooltip(detail: 'A' | 'B' | null) {
        switch (detail) {
            case 'A':
                this.tooltip = '1 ząb: 170 PLN, 2 zęby 250 PLN, 3 zęby 300 PLN, kolejny ząb: +50 PLN';
                break;
            case 'B':
                this.tooltip = '1 punkt: 170 PLN, kolejny punkt: +30 PLN';
                break;
            default:
                return;
        }
    }
}
