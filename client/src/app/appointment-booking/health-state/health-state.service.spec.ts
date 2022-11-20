import { TestBed } from '@angular/core/testing';

import { HealthStateService } from './health-state.service';

describe('HealthStateService', () => {
    let service: HealthStateService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(HealthStateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
