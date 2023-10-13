import { TestBed } from '@angular/core/testing';

import { ClientAppointmentPreviewService } from './client-appointment-preview.service';

describe('ClientAppointmentPreviewService', () => {
    let service: ClientAppointmentPreviewService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ClientAppointmentPreviewService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
