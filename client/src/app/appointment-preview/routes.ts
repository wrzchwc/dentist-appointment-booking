import { Routes } from '@angular/router';
import { appointmentResolver } from './resolvers/appointment.resolver';
import { appointmentListTitleResolver } from './resolvers/appointment-list-title.resolver';
import { appointmentsAtDateResolver } from './resolvers/appointments.resolver';

export const APPOINTMENT_PREVIEW_ROUTES: Routes = [
    {
        path: ':appointmentId',
        title: 'Podgląd wizyty',
        resolve: { preview: appointmentResolver },
        loadComponent: async () =>
            (await import('./components/appointment-preview/appointment-preview.component'))
                .AppointmentPreviewComponent,
    },
    {
        path: '',
        title: appointmentListTitleResolver,
        resolve: {
            appointments: appointmentsAtDateResolver,
        },
        loadComponent: async () =>
            (await import('./components/appointment-list/appointment-list.component')).AppointmentListComponent,
    },
];
