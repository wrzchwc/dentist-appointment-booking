import { TestBed } from '@angular/core/testing';

import { ClientAppointmentService } from './client-appointment.service';

describe('ClientAppointmentService', () => {
    let service: ClientAppointmentService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ClientAppointmentService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
