import { Component } from '@angular/core';
import { DateService } from '../../shared/_services/utility/date.service';
import { ActivatedRoute } from '@angular/router';
import { Appointment } from './admin.service';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
    readonly appointments: Appointment[];

    // eslint-disable-next-line no-unused-vars
    constructor(public date: DateService, public route: ActivatedRoute) {
        this.appointments = route.snapshot.data['appointments'];
    }
}
