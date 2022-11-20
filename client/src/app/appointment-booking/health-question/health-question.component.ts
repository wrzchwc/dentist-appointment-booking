import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { AppointmentQuestion } from '../_services/appointment-questions/appointment-questions.service';
import { FormBuilder, FormControl, FormRecord } from '@angular/forms';
import { HealthStateDescriptor, IdInfo } from '../health-state/health-state.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-health-question',
    templateUrl: './health-question.component.html',
    styleUrls: ['./health-question.component.scss'],
})
export class HealthQuestionComponent implements OnChanges, OnDestroy {
    @Input() question?: AppointmentQuestion;
    @Output() private readonly positive: EventEmitter<HealthStateDescriptor>;
    @Output() private readonly update: EventEmitter<IdInfo>;
    @Output() private readonly negative: EventEmitter<string>;
    readonly response: FormRecord<FormControl<string | boolean>>;
    private readonly onDestroy: Subject<void>;

    // eslint-disable-next-line no-unused-vars
    constructor(private builder: FormBuilder) {
        this.response = this.builder.record({
            positive: this.builder.control<boolean>(false, { nonNullable: true }),
        });
        this.positive = new EventEmitter<HealthStateDescriptor>();
        this.update = new EventEmitter<IdInfo>();
        this.negative = new EventEmitter<string>();
        this.onDestroy = new Subject<void>();
    }

    ngOnDestroy(): void {
        this.onDestroy.next();
    }

    ngOnChanges() {
        if (this.question?.subquestion) {
            const control = this.builder.control<string>('', { nonNullable: true });
            this.response.addControl('detail', control);
            control.valueChanges.pipe(takeUntil(this.onDestroy), debounceTime(375)).subscribe(() => {
                if (this.question) {
                    this.update.emit({ id: this.question.id, additionalInfo: control.value });
                }
            });
        }
    }

    handlePositiveSelection() {
        if (this.question !== undefined) {
            this.positive.emit({ id: this.question.id, payload: { fact: this.question.fact.value } });
        }
    }

    handleNegativeSelection() {
        this.negative.emit(this.question?.id);
    }
}
