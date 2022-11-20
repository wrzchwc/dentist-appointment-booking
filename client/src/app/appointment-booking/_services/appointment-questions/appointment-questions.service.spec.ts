import { TestBed } from '@angular/core/testing';

import { AppointmentQuestionsService } from './appointment-questions.service';

describe('AppointQuestionsService', () => {
    let service: AppointmentQuestionsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AppointmentQuestionsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
