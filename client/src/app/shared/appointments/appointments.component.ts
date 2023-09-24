import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DateService } from '../_services/utility/date.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { AppointmentPreviewComponent } from '../appointment-preview/appointment-preview.component';
import { MatInputModule } from '@angular/material/input';
import { AppointmentsListComponent } from '../appointments-list/appointments-list.component';
import { AppointmentsWrapperComponent } from '../appointments-wrapper/appointments-wrapper.component';

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
    @Input() appointments: Appointment[] = [];

    @Output() readonly dateChange = new EventEmitter<Date>();

    readonly pickerControl = this.formBuilder.control(this.dateService.currentWorkday, {
        nonNullable: true,
    });

    private readonly destroy$ = new Subject<void>();

    constructor(private readonly formBuilder: FormBuilder, private readonly dateService: DateService) {}

    ngOnChanges() {
        this.pickerControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((date) => {
            this.dateChange.emit(date);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}

export interface Appointment {
    id: string;
    startsAt: Date;
    services: Service[];
}

interface Service {
    id: string;
    name: string;
}
