import { TestBed } from '@angular/core/testing';

import { ClientAppointmentsResolver } from '../client-appointments.resolver';

describe('ClientAppointmentsResolver', () => {
    let resolver: ClientAppointmentsResolver;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        resolver = TestBed.inject(ClientAppointmentsResolver);
    });

    it('should be created', () => {
        expect(resolver).toBeTruthy();
    });
});
