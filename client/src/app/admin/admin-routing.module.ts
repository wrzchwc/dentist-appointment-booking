import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AdminAppointmentsComponent } from './admin-appointments/admin-appointments.component';
import { PriceListComponent } from './price-list/price-list.component';
import { AdminResolver } from './admin/admin.resolver';

const routes: Routes = [
    { path: 'appointments', component: AdminAppointmentsComponent, title: 'Wizyty' },
    { path: 'price-list', component: PriceListComponent, title: 'Cennik' },
    { path: '', component: AdminComponent, title: 'Rezerwacje', resolve: { appointments: AdminResolver } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {}
