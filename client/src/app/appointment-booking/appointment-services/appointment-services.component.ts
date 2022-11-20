import { Component, Input } from '@angular/core';
import { Service } from 'src/app/shared/_services/appointments/services.service';

@Component({
    selector: 'app-appointment-services',
    templateUrl: './appointment-services.component.html',
    styleUrls: ['./appointment-services.component.scss'],
})
export class AppointmentServicesComponent {
    @Input() services?: Service[];

    constructor() {}
}
