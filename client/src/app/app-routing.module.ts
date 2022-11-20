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
                loadChildren: () => import('./client/client.module').then((m) => m.ClientModule),
            },
        ],
    },
    {
        path: 'admin',
        canLoad: [AuthenticationGuard],
        loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
    },
    {
        path: '',
        loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
        resolve: { profile: AuthenticationResolver },
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
