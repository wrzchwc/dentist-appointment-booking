import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthenticationResolver } from './shared/resolvers/authentication.resolver';
import { AuthenticationGuard } from './shared/guards/authentication.guard';

const routes: Routes = [
    {
        path: 'client',
        children: [
            {
                path: 'appointment-booking',
                canLoad: [AuthenticationGuard],
                loadChildren: async () =>
                    (await import('./appointment-booking/routes')).APPOINTMENT_BOOKING_ROUTES,
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
        path: '',
        loadComponent: async () => (await import('./shared/components/page/home/home.component')).HomeComponent,
        resolve: { profile: AuthenticationResolver },
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
