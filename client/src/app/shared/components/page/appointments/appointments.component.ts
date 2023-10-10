import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DateService } from '../../../services/date.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { AppointmentPreviewComponent } from '../../ui/appointment-preview/appointment-preview.component';
import { MatInputModule } from '@angular/material/input';
import { AppointmentsListComponent } from '../appointments-list/appointments-list.component';
import { AppointmentsWrapperComponent } from '../appointments-wrapper/appointments-wrapper.component';
import { AppointmentPreview } from '../../../model';

@Component({
    selector: 'app-appointments',
    templateUrl: './appointments.component.html',
    styleUrls: ['./appointments.component.scss'],
    imports: [
        MatFormFieldModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        NgIf,
        AppointmentPreviewComponent,
        NgForOf,
        DatePipe,
        MatInputModule,
        AppointmentsListComponent,
        AppointmentsWrapperComponent,
    ],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentsComponent implements OnChanges, OnDestroy {
    @Input() listTitle: string = '';
    @Input() appointments: AppointmentPreview[] = [];

    @Output() readonly dateChange: EventEmitter<Date> = new EventEmitter();

    readonly pickerControl: FormControl<Date> = this.formBuilder.control(this.dateService.currentWorkday, {
        nonNullable: true,
    });

    private readonly destroy$: Subject<void> = new Subject();

    constructor(private readonly formBuilder: FormBuilder, private readonly dateService: DateService) {}

    ngOnChanges(): void {
        this.pickerControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((date) => {
            this.dateChange.emit(date);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
