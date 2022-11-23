import { Component, Input, OnDestroy } from '@angular/core';
import { AppointmentDateService } from '../appointment-booking/appointment-date.service';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-time-card',
    templateUrl: './time-card.component.html',
    styleUrls: ['./time-card.component.scss'],
})
export class TimeCardComponent implements OnDestroy {
    @Input() date?: Date;
    notSelected: boolean;
    private readonly onDestroy: Subject<void>;

    constructor(private time: AppointmentDateService) {
        this.notSelected = false;
        this.onDestroy = new Subject<void>();
        time.selectedDate$.pipe(takeUntil(this.onDestroy), filter(Boolean)).subscribe((selected) => {
            if (this.date) {
                this.notSelected = selected.getTime() !== new Date(this.date).getTime();
            }
        });
    }

    ngOnDestroy(): void {
        this.onDestroy.next();
    }

    handleClick($event: Event) {
        $event.stopPropagation();
        const selection: Date | null = this.time.selectedDate$.value === this.date ? null : new Date(this.date!);
        this.time.selectedDate$.next(selection);
    }
}
