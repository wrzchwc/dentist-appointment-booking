import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DateService } from '../_services/utility/date.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-date-picker',
    templateUrl: './date-picker.component.html',
    styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {
    @Output() selectionChange: EventEmitter<Date>;
    selectedDate: FormControl<any>;
    private readonly onDestroy: Subject<void>;

    constructor(private date: DateService, private builder: FormBuilder) {
        this.selectedDate = builder.control(date.currentWorkday, { nonNullable: true });
        this.onDestroy = new Subject<void>();
        this.selectionChange = new EventEmitter<Date>();
    }

    ngOnInit(): void {
        this.selectedDate.valueChanges.pipe(takeUntil(this.onDestroy)).subscribe((date) => {
            this.selectionChange.emit(date);
        });
    }
}
