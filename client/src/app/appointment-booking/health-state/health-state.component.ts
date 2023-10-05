import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { HealthStateService } from './health-state.service';
import { filter, Subject, takeUntil } from 'rxjs';
import { AppointmentQuestion, HealthStateDescriptor, Info } from '../model';
import { HealthQuestionComponent } from '../health-question/health-question.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgClass, NgForOf, NgIf } from '@angular/common';

@Component({
    selector: 'app-health-state',
    templateUrl: './health-state.component.html',
    styleUrls: ['./health-state.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [HealthQuestionComponent, MatSlideToggleModule, ReactiveFormsModule, NgClass, NgForOf, NgIf],
    standalone: true,
})
export class HealthStateComponent implements OnInit, OnDestroy {
    @Input() questions: AppointmentQuestion[] = [];

    readonly isWomen: FormControl<boolean> = this.builder.control(false, { nonNullable: true });

    private readonly destroy$: Subject<void> = new Subject();

    constructor(private readonly builder: FormBuilder, private readonly state: HealthStateService) {}

    ngOnInit(): void {
        this.isWomen.valueChanges
            .pipe(
                takeUntil(this.destroy$),
                filter((value) => !value)
            )
            .subscribe(() => {
                this.state.clearWomenOnly();
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    store(descriptor: HealthStateDescriptor): void {
        this.state.store(descriptor);
    }

    remove(id: string): void {
        this.state.remove(id);
    }

    update(info: Info): void {
        this.state.update(info);
    }
}
