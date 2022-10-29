import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client/client.component';
import { ClientAppointmentsComponent } from './client-appointments/client-appointments.component';
import { AppointmentBookingComponent } from './appointment-booking/appointment-booking.component';

@NgModule({
    declarations: [ClientComponent, ClientAppointmentsComponent, AppointmentBookingComponent],
    imports: [CommonModule, ClientRoutingModule],
})
export class ClientModule {}
