import { TestBed } from '@angular/core/testing';

import { AppointmentBookingService } from './appointment-booking.service';

describe('AppointmentBookingService', () => {
    let service: AppointmentBookingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AppointmentBookingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
