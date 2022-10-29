import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client/client.component';
import { ClientAppointmentsComponent } from './client-appointments/client-appointments.component';
import { AppointmentBookingModule } from './appointment-booking/appointment-booking.module';

@NgModule({
    declarations: [ClientComponent, ClientAppointmentsComponent],
    imports: [CommonModule, ClientRoutingModule, AppointmentBookingModule],
})
export class ClientModule {}
