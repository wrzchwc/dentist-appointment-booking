import { Routes } from '@angular/router';
import { AuthenticationGuard } from './shared/guards/authentication.guard';
import { AuthenticationResolver } from './shared/resolvers/authentication.resolver';

export const APP_ROUTES: Routes = [
    {
        path: 'client',
        children: [
            {
                path: 'appointment-booking',
                canLoad: [AuthenticationGuard],
                loadChildren: async () => (await import('./appointment-booking/routes')).APPOINTMENT_BOOKING_ROUTES,
            },
            {
                path: '',
                canLoad: [AuthenticationGuard],
                loadChildren: async () => (await import('./client/routes')).CLIENT_ROUTES,
            },
        ],
    },
    {
        path: 'admin',
        canLoad: [AuthenticationGuard],
        loadChildren: async () => (await import('./admin/routes')).ADMIN_ROUTES,
    },
    {
        path: 'appointment-preview',
        canLoad: [AuthenticationGuard],
        loadChildren: async () => (await import('./appointment-preview/routes')).APPOINTMENT_PREVIEW_ROUTES,
    },
    {
        path: '',
        loadComponent: async () => (await import('./shared/components/page/home/home.component')).HomeComponent,
        resolve: { profile: AuthenticationResolver },
    },
];
