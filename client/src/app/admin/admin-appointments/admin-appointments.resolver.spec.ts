import { TestBed } from '@angular/core/testing';

import { AdminAppointmentsResolver } from './admin-appointments.resolver';

describe('AdminAppointmentsResolver', () => {
    let resolver: AdminAppointmentsResolver;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        resolver = TestBed.inject(AdminAppointmentsResolver);
    });

    it('should be created', () => {
        expect(resolver).toBeTruthy();
    });
});
