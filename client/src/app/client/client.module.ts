import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client/client.component';
import { ClientAppointmentsComponent } from './client-appointments/client-appointments.component';

@NgModule({
    declarations: [ClientComponent, ClientAppointmentsComponent],
    imports: [CommonModule, ClientRoutingModule],
})
export class ClientModule {}
