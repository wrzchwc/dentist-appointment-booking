import { AfterViewChecked, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
    AuthenticationService,
    AppointmentDateService,
    LengthService,
    NamedPriceItem,
    Profile,
    CardComponent,
    ServicesTableComponent,
    PricePipe,
} from '../../shared';
import { AppointmentCartService } from '../appointment-cart.service';
import { filter, map, Observable } from 'rxjs';
import { HealthStateService } from '../health-state/health-state.service';
import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { DateTime } from 'luxon';

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgIf, CardComponent, ServicesTableComponent, DatePipe, AsyncPipe, NgForOf, PricePipe],
    standalone: true,
})
export class SummaryComponent implements OnInit, AfterViewChecked {
    private readonly appointmentLength: number = this.length.calculateTotalLength(this.cart.lengthItems);

    private _endsAt: DateTime = DateTime.now();

    constructor(
        private readonly auth: AuthenticationService,
        private readonly time: AppointmentDateService,
        private readonly cart: AppointmentCartService,
        private readonly length: LengthService,
        private readonly state: HealthStateService
    ) {}

    ngOnInit(): void {
        this.time.selectedDate$
            .pipe(
                filter(Boolean),
                map((date) => DateTime.fromJSDate(date))
            )
            .subscribe((dateTime) => {
                this._endsAt = dateTime.plus({ minute: this.appointmentLength });
            });
    }

    ngAfterViewChecked(): void {
        const { value } = this.time.selectedDate$;
        if (value) {
            this._endsAt = DateTime.fromJSDate(value).plus({ minute: this.appointmentLength });
        }
    }

    get endsAt(): Date {
        return this._endsAt.toJSDate();
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

    get facts() {
        return this.state.facts;
    }
}
