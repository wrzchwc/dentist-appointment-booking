import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './client/client.component';
import { ClientAppointmentsComponent } from './client-appointments/client-appointments.component';
import { ClientAppointmentsResolver } from './client-appointments/client-appointments.resolver';
import { ClientResolver } from './client/client.resolver';
import { ClientAppointmentComponent } from './client-appointment/client-appointment.component';
import { ClientAppointmentResolver } from './client-appointment/client-appointment.resolver';

const routes: Routes = [
    {
        path: 'appointments',
        children: [
            {
                path: ':appointmentId',
                title: 'Podgląd wizyty',
                resolve: { appointment: ClientAppointmentResolver },
                component: ClientAppointmentComponent,
            },
            {
                path: '',
                title: 'Moje wizyty',
                resolve: { appointments: ClientAppointmentsResolver },
                component: ClientAppointmentsComponent,
            },
        ],
    },
    {
        path: '',
        component: ClientComponent,
        title: 'Nadchodzące wizyty',
        resolve: { appointments: ClientResolver },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ClientRoutingModule {}
