import { AfterContentChecked, Component } from '@angular/core';
import { DateService } from 'src/app/shared/_services/date.service';
import { AppointmentTimeService } from '../_services/appointment-time/appointment-time.service';
import { LengthService } from '../../shared/_services/appointments/length.service';
import { AppointmentCartService } from '../_services/appointment-cart/appointment-cart.service';

@Component({
    selector: 'app-date',
    templateUrl: './date.component.html',
    styleUrls: ['./date.component.scss'],
})
export class DateComponent implements AfterContentChecked {
    current: Date;
    next: Date;
    previous: Date;
    availableTimes?: Date[];
    appointmentLength: number;

    constructor(
        public date: DateService,
        private time: AppointmentTimeService,
        private length: LengthService,
        private cart: AppointmentCartService
    ) {
        this.current = date.getCurrentWorkdayDate();
        this.next = date.getNextWorkday(this.current);
        this.previous = date.getPreviousWorkday(this.current);
        this.availableTimes = time.getAvailableTimes(this.current);
        this.appointmentLength = length.calculateTotalLength(cart.getServiceItems());
    }

    ngAfterContentChecked() {
        this.appointmentLength = this.length.calculateTotalLength(this.cart.getServiceItems());
        this.availableTimes = this.time.getAvailableTimes(this.current);
    }

    handlePreviousDate() {
        this.current = this.date.getPreviousWorkday(this.current);
        [this.previous, this.next, this.availableTimes] = this.handleDateChange(this.current);
    }

    handleNextDate() {
        this.current = this.date.getNextWorkday(this.current);
        [this.previous, this.next, this.availableTimes] = this.handleDateChange(this.current);
    }

    private handleDateChange(current: Date): [Date, Date, Date[]] {
        return [
            this.date.getPreviousWorkday(current),
            this.date.getNextWorkday(current),
            this.time.getAvailableTimes(current),
        ];
    }

    handleClick() {
        this.time.selectedTime$.next(null);
    }

    ignoreClick(event: Event) {
        event.stopPropagation();
    }
}
