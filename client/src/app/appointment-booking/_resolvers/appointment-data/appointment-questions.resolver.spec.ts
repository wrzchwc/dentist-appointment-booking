import { TestBed } from '@angular/core/testing';

import { AppointmentQuestionsResolver } from './appointment-questions.resolver';

describe('AppointmentQuestionsResolver', () => {
    let resolver: AppointmentQuestionsResolver;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        resolver = TestBed.inject(AppointmentQuestionsResolver);
    });

    it('should be created', () => {
        expect(resolver).toBeTruthy();
    });
});
