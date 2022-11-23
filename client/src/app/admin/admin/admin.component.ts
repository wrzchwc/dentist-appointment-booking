import { Component } from '@angular/core';
import { DateService } from '../../shared/_services/utility/date.service';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
    // eslint-disable-next-line no-unused-vars
    constructor(public date: DateService) {}
}
