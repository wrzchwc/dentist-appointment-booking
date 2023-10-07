import { TestBed } from '@angular/core/testing';

import { ClientAppointmentResolver } from './client-appointment.resolver';

describe('ClientAppointmentResolver', () => {
    let resolver: ClientAppointmentResolver;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        resolver = TestBed.inject(ClientAppointmentResolver);
    });

    it('should be created', () => {
        expect(resolver).toBeTruthy();
    });
});
