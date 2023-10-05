import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { DateService } from '../../../services/date.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { UpdateStartDateComponent } from '../../ui/update-start-date/update-start-date.component';
import { Location, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-appointment',
    templateUrl: './appointment.component.html',
    styleUrls: ['./appointment.component.scss'],
    imports: [MatIconModule, NgIf, MatButtonModule],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentComponent implements OnChanges {
    @Input() appointmentId?: string;
    @Input() startsAt?: Date;
    @Input() length: number = 0;

    @Output() readonly cancelAppointment = new EventEmitter<void>();

    private readonly dialogConfig: MatDialogConfig = { autoFocus: true };

    cancelable?: boolean;

    constructor(
        private readonly dateService: DateService,
        private readonly matDialog: MatDialog,
        private readonly location: Location
    ) {}

    ngOnChanges(): void {
        if (this.startsAt) {
            this.cancelable = this.dateService.currentDay < new Date(this.startsAt);
        }
    }

    reschedule(): void {
        this.dialogConfig.data = { id: this.appointmentId, startsAt: this.startsAt, length: this.length };
        this.matDialog
            .open(UpdateStartDateComponent, this.dialogConfig)
            .afterClosed()
            .pipe(filter(Boolean))
            .subscribe(() => {
                this.location.back();
            });
    }

    cancel(): void {
        this.cancelAppointment.emit();
    }
}
