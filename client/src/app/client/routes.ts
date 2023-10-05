import { Routes } from '@angular/router';
import { ClientAppointmentResolver } from './client-appointment/client-appointment.resolver';
import { ClientAppointmentComponent } from './client-appointment/client-appointment.component';
import { ClientAppointmentsResolver } from './client-appointments/client-appointments.resolver';
import { ClientAppointmentsComponent } from './client-appointments/client-appointments.component';
import { ClientComponent } from './client/client.component';
import { ClientResolver } from './client/client.resolver';

export const CLIENT_ROUTES: Routes = [
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
