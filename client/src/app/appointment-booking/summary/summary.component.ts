import { Component } from '@angular/core';
import { AuthenticationService } from '../../shared/_services/authentication/authentication.service';
import { AppointmentTimeService } from '../_services/appointment-time/appointment-time.service';

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent {
    // eslint-disable-next-line no-unused-vars
    constructor(public auth: AuthenticationService, public time: AppointmentTimeService) {}
}
