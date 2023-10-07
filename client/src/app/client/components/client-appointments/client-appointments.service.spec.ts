import { TestBed } from '@angular/core/testing';

import { ClientAppointmentsService } from './client-appointments.service';

describe('ClientAppointmentsService', () => {
    let service: ClientAppointmentsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ClientAppointmentsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
