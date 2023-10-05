import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { TooltipService } from '../../shared/_services/tooltip.service';
import { AppointmentCartService } from '../appointment-cart.service';
import { Service } from '../../shared/model';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppointmentTimesPipe } from '../../shared/appointment-times.pipe';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-service-card',
    templateUrl: './service-card.component.html',
    styleUrls: ['./service-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgIf, MatCardModule, MatIconModule, MatTooltipModule, AsyncPipe, AppointmentTimesPipe, MatButtonModule],
    standalone: true,
})
export class ServiceCardComponent implements OnInit, OnChanges {
    @Input() service: Service | undefined;

    @Output() serviceChange: EventEmitter<void> = new EventEmitter();

    private _tooltip: string = '';

    constructor(private readonly tooltipService: TooltipService, private readonly cart: AppointmentCartService) {}

    ngOnInit(): void {
        this._tooltip = this.tooltipService.getTooltip(this.service?.detail);
    }

    ngOnChanges(): void {
        this._tooltip = this.tooltipService.getTooltip(this.service?.detail);
    }

    get tooltip(): string {
        return this._tooltip;
    }

    getQuantityOf(service: Service): Observable<number> {
        return this.cart.quantityOf(service);
    }

    handleRemoveServiceClick(): void {
        if (this.service) {
            this.cart.remove(this.service);
            this.serviceChange.emit();
        }
    }

    handleAddServiceClick(): void {
        if (this.service) {
            this.cart.add(this.service);
            this.serviceChange.emit();
        }
    }
}
