import { TestBed } from '@angular/core/testing';

import { AppointQuestionsService } from './appoint-questions.service';

describe('AppointQuestionsService', () => {
    let service: AppointQuestionsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AppointQuestionsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
