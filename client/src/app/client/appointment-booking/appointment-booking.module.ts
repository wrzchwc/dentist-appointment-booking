import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentBookingComponent } from './appointment-booking/appointment-booking.component';

@NgModule({
    declarations: [AppointmentBookingComponent],
    imports: [CommonModule],
    exports: [AppointmentBookingComponent],
})
export class AppointmentBookingModule {}
