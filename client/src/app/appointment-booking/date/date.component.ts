import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { DateService } from 'src/app/shared/_services/date.service';
import { AppointmentTimeService } from '../_services/appointment-time/appointment-time.service';
import { LengthService } from '../../shared/_services/appointments/length.service';
import { AppointmentCartService } from '../_services/appointment-cart/appointment-cart.service';

@Component({
    selector: 'app-date',
    templateUrl: './date.component.html',
    styleUrls: ['./date.component.scss'],
})
export class DateComponent implements OnInit, AfterViewChecked {
    current: Date;
    next: Date;
    previous: Date;
    availableTimes?: Date[];
    appointmentLength: number;

    constructor(
        // eslint-disable-next-line no-unused-vars
        public time: AppointmentTimeService,
        public date: DateService,
        private length: LengthService,
        private cart: AppointmentCartService
    ) {
        this.current = date.getCurrentWorkdayDate();
        this.next = date.getNextWorkday(this.current);
        this.previous = date.getPreviousWorkday(this.current);
        this.availableTimes = [];
        this.appointmentLength = length.calculateTotalLength(cart.getLengthItems());
    }

    ngOnInit() {
        this.time.getAvailableTimes(this.current).subscribe((times) => {
            this.availableTimes = times;
        });
    }

    ngAfterViewChecked() {
        this.appointmentLength = this.length.calculateTotalLength(this.cart.getLengthItems());
    }

    handlePreviousDate() {
        this.current = this.date.getPreviousWorkday(this.current);
        // [this.previous, this.next, this.availableTimes] = this.handleDateChange(this.current);
    }

    handleNextDate() {
        this.current = this.date.getNextWorkday(this.current);
        // [this.previous, this.next, this.availableTimes] = this.handleDateChange(this.current);
    }

    // private handleDateChange(current: Date): [Date, Date, Date[]] {
    //     return [
    //         this.date.getPreviousWorkday(current),
    //         this.date.getNextWorkday(current),
    //         this.time.getAvailableTimes(current),
    //     ];
    // }

    handleClick() {
        this.time.selectedTime$.next(null);
    }

    ignoreClick(event: Event) {
        event.stopPropagation();
    }
}
