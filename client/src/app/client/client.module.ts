import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client/client.component';
import { ClientAppointmentsComponent } from './client-appointments/client-appointments.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { SharedModule } from '../shared/shared.module';
import { ClientAppointmentComponent } from './client-appointment/client-appointment.component';

@NgModule({
    declarations: [ClientComponent, ClientAppointmentsComponent, ClientAppointmentComponent],
    imports: [
        CommonModule,
        ClientRoutingModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        SharedModule,
    ],
})
export class ClientModule {}
