import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AppointmentDateService } from '../../shared/_services/appointment-date.service';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-time-card',
    templateUrl: './time-card.component.html',
    styleUrls: ['./time-card.component.scss'],
})
export class TimeCardComponent implements OnInit, OnDestroy {
    @Input() date?: Date;

    private readonly destroy$ = new Subject<void>();

    private _notSelected: boolean = false;
    get notSelected(): boolean {
        return this._notSelected;
    }

    constructor(private readonly appointmentDateService: AppointmentDateService) {}

    ngOnInit(): void {
        this.appointmentDateService.selectedDate$
            .pipe(takeUntil(this.destroy$), filter(Boolean))
            .subscribe((selected) => {
                if (this.date) {
                    this._notSelected = selected.getTime() !== new Date(this.date).getTime();
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

    handleClick($event: Event) {
        $event.stopPropagation();
        const selection: Date | null =
            this.appointmentDateService.selectedDate$.value === this.date ? null : new Date(this.date!);
        this.appointmentDateService.selectedDate$.next(selection);
    }
}
