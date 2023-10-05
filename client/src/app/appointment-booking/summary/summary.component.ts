import { AfterViewChecked, ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthenticationService } from '../../shared/_services/authentication/authentication.service';
import { AppointmentDateService } from '../../shared/_services/appointment-date.service';
import { AppointmentCartService } from '../appointment-cart.service';
import { PriceService } from '../../shared/_services/utility/price.service';
import { LengthService } from '../../shared/_services/utility/length.service';
import { filter, Observable } from 'rxjs';
import { HealthStateService } from '../health-state/health-state.service';
import { NamedPriceItem, Profile } from '../../shared/model';
import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { CardComponent } from '../../shared/card/card.component';
import { ServicesTableComponent } from '../../shared/services-table/services-table.component';

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgIf, CardComponent, ServicesTableComponent, DatePipe, AsyncPipe, NgForOf],
    standalone: true,
})
export class SummaryComponent implements AfterViewChecked {
    private _endsAt: Date = new Date();

    constructor(
        private readonly auth: AuthenticationService,
        private readonly time: AppointmentDateService,
        private readonly cart: AppointmentCartService,
        private readonly priceService: PriceService,
        private readonly length: LengthService,
        private readonly state: HealthStateService
    ) {
        time.selectedDate$.pipe(filter(Boolean)).subscribe((value) => {
            const copy = new Date(value);
            const appointmentLength = length.calculateTotalLength(cart.lengthItems);
            this._endsAt = new Date(copy.setMinutes(copy.getMinutes() + appointmentLength));
        });
    }

    ngAfterViewChecked(): void {
        const { value } = this.time.selectedDate$;
        if (value) {
            const copy = new Date(value);
            const appointmentLength = this.length.calculateTotalLength(this.cart.lengthItems);
            this._endsAt = new Date(copy.setMinutes(value.getMinutes() + appointmentLength));
        }
    }

    get endsAt(): Date {
        return this._endsAt;
    }

    get profile(): Profile | undefined {
        return this.auth.profile;
    }

    get selectedDate$(): Observable<Date | null> {
        return this.time.selectedDate$;
    }

    get priceItems(): NamedPriceItem[] {
        return this.cart.priceItems;
    }

    get price(): number {
        return this.priceService.calculateTotalPrice(this.priceItems);
    }

    get facts() {
        return this.state.facts;
    }
}
