import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client/client.component';
import { ClientAppointmentsComponent } from './client-appointments/client-appointments.component';
import { ClientAppointmentPreviewComponent } from './client-appointment-preview/client-appointment-preview.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
    declarations: [ClientComponent, ClientAppointmentsComponent, ClientAppointmentPreviewComponent],
    imports: [CommonModule, ClientRoutingModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
})
export class ClientModule {}
