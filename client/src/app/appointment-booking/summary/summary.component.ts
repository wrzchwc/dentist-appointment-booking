/*eslint no-unused-vars: 0*/
import { AfterViewChecked, Component } from '@angular/core';
import { AuthenticationService } from '../../shared/_services/authentication/authentication.service';
import { AppointmentTimeService } from '../appointment-booking/appointment-time.service';
import { AppointmentCartService } from '../appointment-cart.service';
import { PriceService } from '../../shared/_services/utility/price.service';
import { ColumnDef } from './row-def.pipe';
import { LengthService } from '../../shared/_services/utility/length.service';
import { filter } from 'rxjs';
import { HealthStateService } from '../health-state/health-state.service';

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements AfterViewChecked {
    endsAt?: Date;
    readonly displayedColumns: ColumnDef[];

    constructor(
        public auth: AuthenticationService,
        public time: AppointmentTimeService,
        public cart: AppointmentCartService,
        public price: PriceService,
        private length: LengthService,
        public state: HealthStateService
    ) {
        this.displayedColumns = [
            { label: 'usługa', property: 'name' },
            { label: 'liczba', property: 'quantity' },
            { label: 'wartość', property: 'price' },
        ];

        time.selectedTime$.pipe(filter(Boolean)).subscribe((value) => {
            const copy = new Date(value);
            const appointmentLength = length.calculateTotalLength(cart.getLengthItems());
            this.endsAt = new Date(copy.setMinutes(copy.getMinutes() + appointmentLength));
        });
    }

    ngAfterViewChecked() {
        const { value } = this.time.selectedTime$;
        if (value) {
            const copy = new Date(value);
            const appointmentLength = this.length.calculateTotalLength(this.cart.getLengthItems());
            this.endsAt = new Date(copy.setMinutes(value.getMinutes() + appointmentLength));
        }
    }
}
