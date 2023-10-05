import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentPreviewComponent } from './appointment-preview.component';

describe('ClientAppointmentPreviewComponent', () => {
    let component: AppointmentPreviewComponent;
    let fixture: ComponentFixture<AppointmentPreviewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AppointmentPreviewComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AppointmentPreviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
