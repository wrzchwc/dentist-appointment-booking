import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-appointments',
    templateUrl: './appointments.component.html',
    styleUrls: ['./appointments.component.scss'],
})
export class AppointmentsComponent implements OnChanges, OnDestroy {
    @Input() listTitle?: string;
    @Input() appointments?: Appointment[];
    @Input() pickerControl?: FormControl<Date>;
    @Output() readonly dateChange: EventEmitter<Date>;
    private readonly onDestroy: Subject<void>;

    constructor() {
        this.onDestroy = new Subject<void>();
        this.dateChange = new EventEmitter<Date>();
    }

    ngOnChanges() {
        this.pickerControl?.valueChanges.pipe(takeUntil(this.onDestroy)).subscribe((date) => {
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
