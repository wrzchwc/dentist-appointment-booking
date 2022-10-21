import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CheckAuthenticationResolver } from './_resolvers/authentication/check-authentication.resolver';

const routes: Routes = [
    {
        path: 'client',
        loadChildren: () => import('./client/client.module').then((m) => m.ClientModule),
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
    },
    {
        path: '',
        loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
        resolve: { profile: CheckAuthenticationResolver },
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
