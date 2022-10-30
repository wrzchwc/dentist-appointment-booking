import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentBookingComponent } from './appointment-booking/appointment-booking.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@NgModule({
    declarations: [AppointmentBookingComponent],
    imports: [CommonModule, MatStepperModule, MatButtonModule, RouterLink],
    exports: [AppointmentBookingComponent],
})
export class AppointmentBookingModule {}
