import { Routes } from '@angular/router';
import {
    AppointmentManagementService,
    ClientAppointmentManagementService,
    AdminAppointmentManagementService,
} from '../appointment-managment';
import { appointmentPreviewResolver } from './components/appointment-preview/appointment-preview.resolver';
import { appointmentListTitleResolver } from './components/appointment-list/appointment-list-title.resolver';

export const APPOINTMENT_PREVIEW_ROUTES: Routes = [
    {
        path: ':appointmentId',
        title: 'Podgląd wizyty',
        providers: [
            AppointmentManagementService,
            ClientAppointmentManagementService,
            AdminAppointmentManagementService,
        ],
        resolve: { appointment: appointmentPreviewResolver },
        loadComponent: async () =>
            (await import('./components/appointment-preview/appointment-preview.component'))
                .AppointmentPreviewComponent,
    },
    {
        path: '',
        title: appointmentListTitleResolver,
        providers: [],
        resolve: {},
        loadComponent: async () =>
            (await import('./components/appointment-list/appointment-list.component')).AppointmentListComponent,
    },
];
