import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DateService } from '../_services/utility/date.service';

@Component({
    selector: 'app-appointments',
    templateUrl: './appointments.component.html',
    styleUrls: ['./appointments.component.scss'],
})
export class AppointmentsComponent implements OnChanges, OnDestroy {
    @Input() listTitle?: string;
    @Input() empty: boolean;
    @Output() readonly dateChange: EventEmitter<Date>;
    readonly pickerControl: FormControl<Date>;
    private readonly onDestroy: Subject<void>;

    constructor(private builder: FormBuilder, private date: DateService) {
        this.onDestroy = new Subject<void>();
        this.dateChange = new EventEmitter<Date>();
        this.pickerControl = builder.control(date.currentWorkday, { nonNullable: true });
        this.empty = true;
    }

    ngOnChanges() {
        this.pickerControl.valueChanges.pipe(takeUntil(this.onDestroy)).subscribe((date) => {
            this.dateChange.emit(date);
        });
    }

    ngOnDestroy(): void {
        this.onDestroy.next();
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
