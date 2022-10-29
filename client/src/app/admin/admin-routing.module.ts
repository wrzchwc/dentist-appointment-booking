import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AdminAppointmentsComponent } from './admin-appointments/admin-appointments.component';
import { PriceListComponent } from './price-list/price-list.component';

const routes: Routes = [
    { path: 'appointments', component: AdminAppointmentsComponent, title: 'Wizyty' },
    { path: 'price-list', component: PriceListComponent, title: 'Cennik' },
    { path: '', component: AdminComponent, title: 'Panel administratora' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {}
