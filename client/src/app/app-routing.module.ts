import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthenticationResolver } from './shared/_resolvers/authentication/authentication.resolver';
import { AuthenticationGuard } from './shared/_guards/authentication/authentication.guard';

const routes: Routes = [
    {
        path: 'client',
        canLoad: [AuthenticationGuard],
        loadChildren: () => import('./client/client.module').then((m) => m.ClientModule),
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
