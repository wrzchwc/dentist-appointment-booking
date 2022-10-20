import { TestBed } from '@angular/core/testing';

import { INTInterceptor } from '../../int.interceptor';

describe('INTInterceptor', () => {
    beforeEach(() =>
        TestBed.configureTestingModule({
            providers: [INTInterceptor],
        })
    );

    it('should be created', () => {
        const interceptor: INTInterceptor = TestBed.inject(INTInterceptor);
        expect(interceptor).toBeTruthy();
    });
});
