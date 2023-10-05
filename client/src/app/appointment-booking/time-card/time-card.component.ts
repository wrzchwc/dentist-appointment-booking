import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AppointmentDateService } from '../../shared/_services/appointment-date.service';
import { filter, map, Subject, takeUntil } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { DatePipe, NgClass, NgIf } from '@angular/common';

@Component({
    selector: 'app-time-card',
    templateUrl: './time-card.component.html',
    styleUrls: ['./time-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCardModule, NgIf, NgClass, DatePipe],
    standalone: true,
})
export class TimeCardComponent implements OnInit, OnDestroy {
    @Input() date: Date = new Date();

    private readonly destroy$: Subject<void> = new Subject();

    private _notSelected: boolean = false;

    constructor(private readonly appointmentDateService: AppointmentDateService) {}

    ngOnInit(): void {
        this.appointmentDateService.selectedDate$
            .pipe(takeUntil(this.destroy$), filter(Boolean), map(Date.prototype.getTime))
            .subscribe((time) => {
                this._notSelected = time !== new Date(this.date).getTime();
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    get notSelected(): boolean {
        return this._notSelected;
    }

    handleClick($event: Event) {
        $event.stopPropagation();
        const selection: Date | null =
            this.appointmentDateService.selectedDate$.value === this.date ? null : new Date(this.date);
        this.appointmentDateService.selectedDate$.next(selection);
    }
}
