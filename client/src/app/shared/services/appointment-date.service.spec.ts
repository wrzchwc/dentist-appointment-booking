import { TestBed } from '@angular/core/testing';

import { AppointmentDateService } from './appointment-date.service';

describe('AppointmentDateService', () => {
    let service: AppointmentDateService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AppointmentDateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
