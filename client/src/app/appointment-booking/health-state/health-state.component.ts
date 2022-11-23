import { Component, Input, OnDestroy } from '@angular/core';
import { AppointmentQuestion } from '../appointment-booking/appointment-booking.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { HealthStateService } from './health-state.service';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-health-state',
    templateUrl: './health-state.component.html',
    styleUrls: ['./health-state.component.scss'],
})
export class HealthStateComponent implements OnDestroy {
    @Input() questions?: AppointmentQuestion[];
    readonly isWomen: FormControl<boolean>;
    private readonly onDestroy: Subject<void>;

    // eslint-disable-next-line no-unused-vars
    constructor(private builder: FormBuilder, public state: HealthStateService) {
        this.onDestroy = new Subject<void>();
        this.isWomen = builder.control(false, { nonNullable: true });
        this.isWomen.valueChanges
            .pipe(
                takeUntil(this.onDestroy),
                filter((value) => !value)
            )
            .subscribe(() => {
                this.state.clearWomenOnly();
            });
    }

    ngOnDestroy(): void {
        this.onDestroy.next();
    }
}
