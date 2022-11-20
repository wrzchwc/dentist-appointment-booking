import { AppointmentTimesPipe } from './appointment-times.pipe';

describe('AppointmentTimesPipe', () => {
    it('create an instance', () => {
        const pipe = new AppointmentTimesPipe();
        expect(pipe).toBeTruthy();
    });
});
