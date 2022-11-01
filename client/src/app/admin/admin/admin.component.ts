import { Component } from '@angular/core';
import { DateService } from '../../shared/_services/appointments/date.service';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
    currentDate: Date;

    constructor(private date: DateService) {
        this.currentDate = date.getCurrentDate();
    }
}
