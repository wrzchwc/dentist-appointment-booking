import { TestBed } from '@angular/core/testing';

import { AppointmentTimeService } from './appointment-time.service';

describe('AppointmentTimeService', () => {
    let service: AppointmentTimeService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AppointmentTimeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
