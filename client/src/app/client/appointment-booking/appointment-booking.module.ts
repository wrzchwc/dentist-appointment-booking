import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentBookingComponent } from './appointment-booking/appointment-booking.component';
import { MatStepperModule } from '@angular/material/stepper';

@NgModule({
    declarations: [AppointmentBookingComponent],
    imports: [CommonModule, MatStepperModule],
    exports: [AppointmentBookingComponent],
})
export class AppointmentBookingModule {}
