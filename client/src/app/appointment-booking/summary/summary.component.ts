import { Component } from '@angular/core';
import { AuthenticationService } from '../../shared/_services/authentication/authentication.service';
import { AppointmentTimeService } from '../_services/appointment-time/appointment-time.service';
import { AppointmentCartService } from '../_services/appointment-cart/appointment-cart.service';

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent {
    constructor(
        // eslint-disable-next-line no-unused-vars
        public auth: AuthenticationService,
        // eslint-disable-next-line no-unused-vars
        public time: AppointmentTimeService,
        // eslint-disable-next-line no-unused-vars
        public cart: AppointmentCartService
    ) {}
}
