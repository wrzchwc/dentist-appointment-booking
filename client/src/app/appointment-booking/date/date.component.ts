import { AfterViewChecked, ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DateService } from 'src/app/shared/services/date.service';
import { AppointmentDateService } from '../../shared/services/appointment-date.service';
import { LengthService } from '../../shared/services/length.service';
import { AppointmentCartService } from '../appointment-cart.service';
import { DatePipe, NgForOf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TimeCardComponent } from '../time-card/time-card.component';

@Component({
    selector: 'app-date',
    templateUrl: './date.component.html',
    styleUrls: ['./date.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgForOf, DatePipe, MatButtonModule, TimeCardComponent],
    standalone: true,
})
export class DateComponent implements AfterViewChecked {
    @Input() availableTimes: Date[] = [];

    @Output() workdayChange: EventEmitter<void> = new EventEmitter();

    appointmentLength: number = this.length.calculateTotalLength(this.cart.lengthItems);

    constructor(
        private readonly time: AppointmentDateService,
        private readonly date: DateService,
        private readonly length: LengthService,
        private readonly cart: AppointmentCartService
    ) {}

    get currentWorkday(): Date {
        return this.date.currentWorkday;
    }

    get previousWorkday(): Date {
        return this.date.previousWorkday;
    }

    get nextWorkday(): Date {
        return this.date.nextWorkday;
    }

    get isPreviousWorkdayDisabled(): boolean {
        const { currentDay, currentWorkday } = this.date;
        return (
            currentDay.getFullYear() === currentWorkday.getFullYear() &&
            currentDay.getMonth() === currentWorkday.getMonth() &&
            currentDay.getDate() === currentWorkday.getDate()
        );
    }

    ngAfterViewChecked(): void {
        this.appointmentLength = this.length.calculateTotalLength(this.cart.lengthItems);
    }

    handleClick(): void {
        this.time.selectedDate$.next(null);
    }

    handleNextWorkday(): void {
        this.date.workdayForward();
        this.workdayChange.emit();
    }

    handlePreviousWorkday(): void {
        this.date.workdayBackward();
        this.workdayChange.emit();
    }

    ignoreClick(event: Event): void {
        event.stopPropagation();
    }
}
