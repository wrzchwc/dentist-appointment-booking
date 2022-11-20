import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAppointmentPreviewComponent } from './client-appointment-preview.component';

describe('ClientAppointmentPreviewComponent', () => {
    let component: ClientAppointmentPreviewComponent;
    let fixture: ComponentFixture<ClientAppointmentPreviewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ClientAppointmentPreviewComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ClientAppointmentPreviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
