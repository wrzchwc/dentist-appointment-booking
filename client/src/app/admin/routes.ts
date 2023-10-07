import { Routes } from '@angular/router';
import { AdminAppointmentResolver } from './components/page/admin-appointment/admin-appointment.resolver';
import { AdminAppointmentComponent } from './components/page/admin-appointment/admin-appointment.component';
import { AdminAppointmentsResolver } from './components/page/admin-appointments/admin-appointments.resolver';
import { AdminAppointmentsComponent } from './components/page/admin-appointments/admin-appointments.component';
import { PriceListComponent } from './components/page/price-list/price-list.component';
import { ServicesResolver } from '../shared/resolvers/services.resolver';
import { AdminComponent } from './components/page/admin/admin.component';
import { AdminResolver } from './components/page/admin/admin.resolver';

export const ADMIN_ROUTES: Routes = [
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
