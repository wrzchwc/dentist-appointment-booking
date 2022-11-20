import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthQuestionComponent } from './health-question.component';

describe('HealthQuestionComponent', () => {
    let component: HealthQuestionComponent;
    let fixture: ComponentFixture<HealthQuestionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HealthQuestionComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HealthQuestionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
