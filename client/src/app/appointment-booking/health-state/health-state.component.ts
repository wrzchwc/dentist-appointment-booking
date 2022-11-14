import { Component, Input } from '@angular/core';
import { AppointmentQuestion } from '../_services/appointment-questions/appointment-questions.service';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
    selector: 'app-health-state',
    templateUrl: './health-state.component.html',
    styleUrls: ['./health-state.component.scss'],
})
export class HealthStateComponent {
    @Input() questions?: AppointmentQuestion[];
    isWomen: FormControl<boolean>;

    constructor(private builder: FormBuilder) {
        this.isWomen = builder.control(false, { nonNullable: true });
    }
}
