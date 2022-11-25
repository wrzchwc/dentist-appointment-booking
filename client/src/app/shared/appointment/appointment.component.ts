import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { DateService } from '../_services/utility/date.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { filter, Subject, takeUntil } from 'rxjs';
import { UpdateStartDateComponent } from '../update-start-date/update-start-date.component';
import { Location } from '@angular/common';

@Component({
    selector: 'app-appointment',
    templateUrl: './appointment.component.html',
    styleUrls: ['./appointment.component.scss'],
})
export class AppointmentComponent implements OnChanges, OnDestroy {
    @Input() appointmentId?: string;
    @Input() startsAt?: Date;
    @Input() length: number;
    @Output() readonly cancel: EventEmitter<void>;
    private readonly dialogConfig: MatDialogConfig;
    private readonly onDestroy: Subject<void>;
    cancelable?: boolean;

    // eslint-disable-next-line no-unused-vars
    constructor(private date: DateService, private dialog: MatDialog, private location: Location) {
        this.cancel = new EventEmitter<void>();
        this.dialogConfig = { autoFocus: true };
        this.onDestroy = new Subject<void>();
        this.length = 0;
    }

    ngOnChanges(): void {
        if (this.startsAt) {
            this.cancelable = this.date.currentDay < new Date(this.startsAt);
        }
    }

    ngOnDestroy(): void {
        this.onDestroy.next();
    }

    handleReschedule() {
        this.dialogConfig.data = { id: this.appointmentId, startsAt: this.startsAt, length: this.length };
        this.dialog
            .open(UpdateStartDateComponent, this.dialogConfig)
            .afterClosed()
            .pipe(takeUntil(this.onDestroy), filter(Boolean))
            .subscribe(() => {
                this.location.back();
            });
    }
}
