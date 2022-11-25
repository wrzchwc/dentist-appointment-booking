import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import { AdminAppointmentsComponent } from './admin-appointments/admin-appointments.component';
import { PriceListComponent } from './price-list/price-list.component';
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { AdminAppointmentComponent } from './admin-appointment/admin-appointment.component';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
    declarations: [AdminComponent, AdminAppointmentsComponent, PriceListComponent, AdminAppointmentComponent],
    imports: [
        CommonModule,
        AdminRoutingModule,
        SharedModule,
        MatIconModule,
        MatCardModule,
        MatTooltipModule,
        MatButtonModule,
        MatMenuModule,
    ],
})
export class AdminModule {}
