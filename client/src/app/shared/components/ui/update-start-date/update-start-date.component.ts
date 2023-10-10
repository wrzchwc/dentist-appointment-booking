import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UpdateStartDateService } from './update-start-date.service';
import { AppointmentDateService } from '../../../services/appointment-date.service';
import { DateService } from '../../../services/date.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { AsyncPipe, DatePipe, NgForOf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UpdateStartDateDialogData } from './model';

@Component({
    selector: 'app-update-start-date',
    templateUrl: './update-start-date.component.html',
    styleUrls: ['./update-start-date.component.scss'],
    imports: [
        MatDialogModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatSelectModule,
        ReactiveFormsModule,
        DatePipe,
        MatInputModule,
        MatButtonModule,
        NgForOf,
        AsyncPipe,
    ],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateStartDateComponent implements OnInit, OnDestroy {
    readonly formGroup = this.formBuilder.group({
        dateControl: this.formBuilder.control(this.updateStateDateDialogData.startsAt, { nonNullable: true }),
        timeControl: this.formBuilder.control(this.updateStateDateDialogData.startsAt, { nonNullable: true }),
    });

    private readonly destroy$ = new Subject<void>();

    availableDates$ = this.appointmentDateService.getAvailableDates(
        new Date(this.updateStateDateDialogData.startsAt),
        this.updateStateDateDialogData.length
    );

    private _min = this.dateService.currentDay.toISOString().slice(0, 10);
    get min(): string {
        return this._min;
    }

    constructor(
        private readonly dialogRef: MatDialogRef<UpdateStartDateComponent>,
        @Inject(MAT_DIALOG_DATA) private updateStateDateDialogData: UpdateStartDateDialogData,
        private readonly formBuilder: FormBuilder,
        private readonly updateStartDateService: UpdateStartDateService,
        private readonly appointmentDateService: AppointmentDateService,
        private readonly dateService: DateService
    ) {}

    ngOnInit(): void {
        this.formGroup.controls['dateControl'].valueChanges.pipe(takeUntil(this.destroy$)).subscribe((date) => {
            const { length } = this.updateStateDateDialogData;
            this.availableDates$ = this.appointmentDateService.getAvailableDates(date, length);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

    reschedule(): void {
        const { value } = this.formGroup.controls['timeControl'];

        this.updateStartDateService
            .rescheduleAppointment(this.updateStateDateDialogData.id, value)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.dialogRef.close(value);
            });
    }

    cancel(): void {
        this.dialogRef.close();
    }
}
