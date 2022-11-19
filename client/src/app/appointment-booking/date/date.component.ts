import { AfterViewChecked, Component, Input } from '@angular/core';
import { DateService } from 'src/app/shared/_services/date.service';
import { AppointmentTimeService } from '../_services/appointment-time/appointment-time.service';
import { LengthService } from '../../shared/_services/appointments/length.service';
import { AppointmentCartService } from '../_services/appointment-cart/appointment-cart.service';

@Component({
    selector: 'app-date',
    templateUrl: './date.component.html',
    styleUrls: ['./date.component.scss'],
})
export class DateComponent implements AfterViewChecked {
    @Input() availableTimes: Date[];
    appointmentLength: number;

    constructor(
        // eslint-disable-next-line no-unused-vars
        public time: AppointmentTimeService,
        // eslint-disable-next-line no-unused-vars
        public date: DateService,
        private length: LengthService,
        private cart: AppointmentCartService
    ) {
        this.availableTimes = [];
        this.appointmentLength = length.calculateTotalLength(cart.getLengthItems());
    }

    ngAfterViewChecked() {
        this.appointmentLength = this.length.calculateTotalLength(this.cart.getLengthItems());
    }

    handleClick() {
        this.time.selectedTime$.next(null);
    }

    ignoreClick(event: Event) {
        event.stopPropagation();
    }
}
