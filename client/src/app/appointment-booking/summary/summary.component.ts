/*eslint no-unused-vars: 0*/
import { Component } from '@angular/core';
import { AuthenticationService } from '../../shared/_services/authentication/authentication.service';
import { AppointmentTimeService } from '../_services/appointment-time/appointment-time.service';
import { AppointmentCartService } from '../_services/appointment-cart/appointment-cart.service';
import { PriceService } from '../../shared/_services/appointments/price.service';

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent {
    constructor(
        public auth: AuthenticationService,
        public time: AppointmentTimeService,
        public cart: AppointmentCartService,
        public price: PriceService
    ) {}
}
