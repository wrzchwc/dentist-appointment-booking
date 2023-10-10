import { CancelablePipe } from './cancelable.pipe';

describe('CancelablePipe', () => {
    it('create an instance', () => {
        const pipe = new CancelablePipe();
        expect(pipe).toBeTruthy();
    });
});
