import { TestBed } from '@angular/core/testing';

import { AdminAppointmentResolver } from './admin-appointment.resolver';

describe('AdminAppointmentResolver', () => {
    let resolver: AdminAppointmentResolver;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        resolver = TestBed.inject(AdminAppointmentResolver);
    });

    it('should be created', () => {
        expect(resolver).toBeTruthy();
    });
});
