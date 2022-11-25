import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStartDateComponent } from './update-start-date.component';

describe('UpdateStartDateComponent', () => {
    let component: UpdateStartDateComponent;
    let fixture: ComponentFixture<UpdateStartDateComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UpdateStartDateComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(UpdateStartDateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
