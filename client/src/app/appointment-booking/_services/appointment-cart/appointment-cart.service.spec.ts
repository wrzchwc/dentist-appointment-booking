import { TestBed } from '@angular/core/testing';

import { AppointmentCartService } from './appointment-cart.service';

describe('AppointmentCartService', () => {
    let service: AppointmentCartService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AppointmentCartService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
