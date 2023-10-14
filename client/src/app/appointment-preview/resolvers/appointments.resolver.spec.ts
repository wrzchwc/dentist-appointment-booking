import { TestBed } from '@angular/core/testing';

import { AppointmentsResolver } from './appointments.resolver';

describe('AppointmentsResolver', () => {
    let resolver: AppointmentsResolver;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        resolver = TestBed.inject(AppointmentsResolver);
    });

    it('should be created', () => {
        expect(resolver).toBeTruthy();
    });
});
