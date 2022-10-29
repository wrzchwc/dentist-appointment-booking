import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import { AdminAppointmentsComponent } from './admin-appointments/admin-appointments.component';
import { PriceListComponent } from './price-list/price-list.component';

@NgModule({
    declarations: [AdminComponent, AdminAppointmentsComponent, PriceListComponent],
    imports: [CommonModule, AdminRoutingModule],
})
export class AdminModule {}
