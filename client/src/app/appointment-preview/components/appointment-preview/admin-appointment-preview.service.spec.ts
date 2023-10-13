import { TestBed } from '@angular/core/testing';

import { AdminAppointmentPreviewService } from './admin-appointment-preview.service';

describe('AdminAppointmentPreviewService', () => {
    let service: AdminAppointmentPreviewService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AdminAppointmentPreviewService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
