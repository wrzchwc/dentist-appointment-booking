import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AdminAppointmentsComponent } from './admin-appointments/admin-appointments.component';
import { PriceListComponent } from './price-list/price-list.component';
import { AdminResolver } from './admin/admin.resolver';
import { AdminAppointmentsResolver } from './admin-appointments/admin-appointments.resolver';
import { AdminAppointmentComponent } from './admin-appointment/admin-appointment.component';
import { AdminAppointmentResolver } from './admin-appointment/admin-appointment.resolver';
import { ServicesResolver } from '../shared/services.resolver';

const routes: Routes = [
    {
        path: 'appointments',
        children: [
            {
                path: ':appointmentId',
                title: 'Podgląd wizyty',
                resolve: { appointment: AdminAppointmentResolver },
                component: AdminAppointmentComponent,
            },
            {
                path: '',
                title: 'Wizyty',
                resolve: { appointments: AdminAppointmentsResolver },
                component: AdminAppointmentsComponent,
            },
        ],
    },
    { path: 'price-list', component: PriceListComponent, title: 'Cennik', resolve: { services: ServicesResolver } },
    { path: '', component: AdminComponent, title: 'Rezerwacje', resolve: { appointments: AdminResolver } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {}
