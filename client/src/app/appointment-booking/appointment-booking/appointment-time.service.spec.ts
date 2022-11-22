import { TestBed } from '@angular/core/testing';

import { AppointmentDateService } from './appointment-date.service';

describe('AppointmentTimeService', () => {
    let service: AppointmentDateService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AppointmentDateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
