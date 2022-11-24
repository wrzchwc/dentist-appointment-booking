import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-appointments',
    templateUrl: './appointments.component.html',
    styleUrls: ['./appointments.component.scss'],
})
export class AppointmentsComponent {
    @Input() listTitle?: string;
    @Input() appointments?: Appointment[];
    @Input() pickerControl?: FormControl<Date>;

    constructor() {}
}

export interface Appointment {
    id: string;
    startsAt: Date;
    services: Service[];
}

interface Service {
    id: string;
    name: string;
}
