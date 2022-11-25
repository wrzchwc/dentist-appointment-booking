import { TestBed } from '@angular/core/testing';

import { UpdateStartDateService } from './update-start-date.service';

describe('UpdateStartDateService', () => {
    let service: UpdateStartDateService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(UpdateStartDateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
