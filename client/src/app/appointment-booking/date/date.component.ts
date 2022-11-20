import { AfterViewChecked, Component, EventEmitter, Input, Output } from '@angular/core';
import { DateService } from 'src/app/shared/_services/utility/date.service';
import { AppointmentTimeService } from '../appointment-booking/appointment-time.service';
import { LengthService } from '../../shared/_services/utility/length.service';
import { AppointmentCartService } from '../appointment-cart.service';

@Component({
    selector: 'app-date',
    templateUrl: './date.component.html',
    styleUrls: ['./date.component.scss'],
})
export class DateComponent implements AfterViewChecked {
    @Input() availableTimes: Date[];
    @Output() workdayChange: EventEmitter<void>;
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
        this.workdayChange = new EventEmitter<void>();
    }

    ngAfterViewChecked() {
        this.appointmentLength = this.length.calculateTotalLength(this.cart.getLengthItems());
    }

    handleClick() {
        this.time.selectedTime$.next(null);
    }

    handleNextWorkday() {
        this.date.workdayForward();
        this.workdayChange.emit();
    }

    handlePreviousWorkday() {
        this.date.workdayBackward();
        this.workdayChange.emit();
    }

    ignoreClick(event: Event) {
        event.stopPropagation();
    }
}
