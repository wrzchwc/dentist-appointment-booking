import { Component, Input, OnChanges } from '@angular/core';
import { AppointmentQuestion } from '../_services/appointment-questions/appointment-questions.service';
import { FormBuilder, FormControl, FormRecord } from '@angular/forms';

@Component({
    selector: 'app-health-question',
    templateUrl: './health-question.component.html',
    styleUrls: ['./health-question.component.scss'],
})
export class HealthQuestionComponent implements OnChanges {
    @Input() question?: AppointmentQuestion;
    response: FormRecord<FormControl<string | boolean>>;

    // eslint-disable-next-line no-unused-vars
    constructor(private builder: FormBuilder) {
        this.response = this.builder.record({
            positive: this.builder.control<boolean>(false, { nonNullable: true }),
        });
    }

    ngOnChanges() {
        if (this.question?.subquestion) {
            const control = this.builder.control<string>('', { nonNullable: true });
            this.response.addControl('detail', control);
        }
    }
}
