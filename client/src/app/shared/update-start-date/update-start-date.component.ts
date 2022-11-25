/*eslint no-unused-vars: 0*/
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UpdateStartDateService } from './update-start-date.service';
import { AppointmentDateService } from '../_services/appointment-date.service';
import { DateService } from '../_services/utility/date.service';

@Component({
    selector: 'app-update-start-date',
    templateUrl: './update-start-date.component.html',
    styleUrls: ['./update-start-date.component.scss'],
})
export class UpdateStartDateComponent implements OnInit, OnDestroy {
    availableDates?: Date[];
    readonly formGroup: FormGroup;
    readonly min: string; // minimal date for date picker (check template)
    private readonly onDestroy: Subject<void>;

    constructor(
        private dialogRef: MatDialogRef<UpdateStartDateComponent>,
        @Inject(MAT_DIALOG_DATA) public data: UpdateStateDateDialogData,
        private builder: FormBuilder,
        private updateStartDate: UpdateStartDateService,
        private appointmentDate: AppointmentDateService,
        private date: DateService
    ) {
        this.formGroup = builder.group({
            dateControl: builder.control<Date>(data.startsAt, { nonNullable: true }),
            timeControl: builder.control<Date>(data.startsAt, { nonNullable: true }),
        });
        this.onDestroy = new Subject<void>();
        this.min = date.currentDay.toISOString().slice(0, 10);
        this.appointmentDate
            .getAvailableDates(new Date(data.startsAt), data.length)
            .pipe(takeUntil(this.onDestroy))
            .subscribe((dates) => {
                this.availableDates = dates;
            });
    }

    ngOnInit(): void {
        this.formGroup.controls['dateControl'].valueChanges.pipe(takeUntil(this.onDestroy)).subscribe((date) => {
            this.appointmentDate
                .getAvailableDates(date, this.data.length)
                .pipe(takeUntil(this.onDestroy))
                .subscribe((dates) => {
                    this.availableDates = dates;
                });
        });
    }

    ngOnDestroy(): void {
        this.onDestroy.next();
    }

    handleReschedule() {
        this.updateStartDate
            .rescheduleAppointment(this.data.id, this.formGroup.controls['timeControl'].value)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(() => {
                this.dialogRef.close(this.formGroup.controls['timeControl'].value);
            });
    }

    handleCancel() {
        this.dialogRef.close();
    }
}

interface UpdateStateDateDialogData {
    id: string;
    length: number;
    startsAt: Date;
}
