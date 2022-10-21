import { TestBed } from '@angular/core/testing';

import { CheckAuthenticationResolver } from './check-authentication.resolver';

describe('CheckAuthenticationResolver', () => {
    let resolver: CheckAuthenticationResolver;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        resolver = TestBed.inject(CheckAuthenticationResolver);
    });

    it('should be created', () => {
        expect(resolver).toBeTruthy();
    });
});
