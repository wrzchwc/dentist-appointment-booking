import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { UpdateStartDateComponent } from '../../ui/update-start-date/update-start-date.component';
import { Location, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CancelablePipe } from './cancelable.pipe';

@Component({
    selector: 'app-appointment',
    templateUrl: './appointment.component.html',
    styleUrls: ['./appointment.component.scss'],
    imports: [MatIconModule, NgIf, MatButtonModule, CancelablePipe],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentComponent {
    @Input() appointmentId: string = '';
    @Input() startsAt: Date = new Date();
    @Input() length: number = 0;

    @Output() readonly cancelAppointment: EventEmitter<void> = new EventEmitter();

    private readonly dialogConfig: MatDialogConfig = { autoFocus: true };

    constructor(
        private readonly matDialog: MatDialog,
        private readonly location: Location
    ) {}

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
