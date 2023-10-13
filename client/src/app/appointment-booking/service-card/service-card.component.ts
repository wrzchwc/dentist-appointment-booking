import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AppointmentCartService } from '../appointment-cart.service';
import { Service } from '../../shared';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppointmentTimesPipe } from '../../shared/pipes/appointment-times.pipe';
import { MatButtonModule } from '@angular/material/button';
import { TooltipPipe } from '../../shared/pipes/tooltip.pipe';

@Component({
    selector: 'app-service-card',
    templateUrl: './service-card.component.html',
    styleUrls: ['./service-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NgIf,
        MatCardModule,
        MatIconModule,
        MatTooltipModule,
        AsyncPipe,
        AppointmentTimesPipe,
        MatButtonModule,
        TooltipPipe,
    ],
    standalone: true,
})
export class ServiceCardComponent {
    @Input() service: Service | undefined;

    @Output() serviceChange: EventEmitter<void> = new EventEmitter();

    constructor(private readonly cart: AppointmentCartService) {}

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
