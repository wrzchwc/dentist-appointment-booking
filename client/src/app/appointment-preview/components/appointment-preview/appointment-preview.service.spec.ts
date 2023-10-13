import { TestBed } from '@angular/core/testing';

import { AppointmentPreviewService } from './appointment-preview.service';

describe('AppointmentPreviewService', () => {
    let service: AppointmentPreviewService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AppointmentPreviewService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
