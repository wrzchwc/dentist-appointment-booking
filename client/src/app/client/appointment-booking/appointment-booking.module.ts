import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentBookingComponent } from './appointment-booking/appointment-booking.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ServiceCardComponent } from './service-card/service-card.component';
import { AppointmentServicesComponent } from './appointment-services/appointment-services.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AppointmentTimesPipe } from './_pipes/appointment-times.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    declarations: [
        AppointmentBookingComponent,
        ServiceCardComponent,
        AppointmentServicesComponent,
        AppointmentTimesPipe,
    ],
    imports: [
        CommonModule,
        MatStepperModule,
        MatButtonModule,
        RouterLink,
        MatCardModule,
        MatIconModule,
        MatTooltipModule,
    ],
    exports: [AppointmentBookingComponent],
})
export class AppointmentBookingModule {}
