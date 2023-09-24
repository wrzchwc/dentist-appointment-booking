import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthenticationResolver } from './authentication.resolver';
import { AuthenticationGuard } from './authentication.guard';

const routes: Routes = [
    {
        path: 'client',
        children: [
            {
                path: 'appointment-booking',
                canLoad: [AuthenticationGuard],
                loadChildren: () =>
                    import('./appointment-booking/appointment-booking.module').then((m) => m.AppointmentBookingModule),
            },
            {
                path: '',
                canLoad: [AuthenticationGuard],
                loadChildren: () => import('./client/client.routes').then((m) => m.CLIENT_ROUTES),
            },
        ],
    },
    {
        path: 'admin',
        canLoad: [AuthenticationGuard],
        loadChildren: () => import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
    },
    {
        path: '',
        loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
        resolve: { profile: AuthenticationResolver },
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
