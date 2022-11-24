import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import { AdminAppointmentsComponent } from './admin-appointments/admin-appointments.component';
import { PriceListComponent } from './price-list/price-list.component';
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [AdminComponent, AdminAppointmentsComponent, PriceListComponent],
    imports: [CommonModule, AdminRoutingModule, SharedModule, MatIconModule],
})
export class AdminModule {}
