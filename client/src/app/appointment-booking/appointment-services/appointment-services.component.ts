import { Component, Input } from '@angular/core';
import { Service } from '../../shared/shared.model';

@Component({
    selector: 'app-appointment-services',
    templateUrl: './appointment-services.component.html',
    styleUrls: ['./appointment-services.component.scss'],
})
export class AppointmentServicesComponent {
    @Input() services?: Service[];

    constructor() {}
}
