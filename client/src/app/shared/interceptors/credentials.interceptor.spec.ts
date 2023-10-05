import { TestBed } from '@angular/core/testing';

import { CredentialsInterceptor } from './credentials.interceptor.spec';

describe('INTInterceptor', () => {
    beforeEach(() =>
        TestBed.configureTestingModule({
            providers: [CredentialsInterceptor],
        })
    );

    it('should be created', () => {
        const interceptor: CredentialsInterceptor = TestBed.inject(CredentialsInterceptor);
        expect(interceptor).toBeTruthy();
    });
});
