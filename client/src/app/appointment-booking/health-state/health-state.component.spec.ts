import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthStateComponent } from './health-state.component';

describe('HealthStateComponent', () => {
    let component: HealthStateComponent;
    let fixture: ComponentFixture<HealthStateComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HealthStateComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HealthStateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
