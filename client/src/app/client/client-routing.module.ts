import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './client/client.component';
import { ClientAppointmentsComponent } from './client-appointments/client-appointments.component';
import { ClientAppointmentsResolver } from './client-appointments.resolver';
import { ClientResolver } from './client/client.resolver';

const routes: Routes = [
    {
        path: 'appointments',
        component: ClientAppointmentsComponent,
        title: 'Moje wizyty',
        resolve: { appointments: ClientAppointmentsResolver },
    },
    {
        path: '',
        component: ClientComponent,
        title: 'Panel klienta',
        resolve: { appointments: ClientResolver },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ClientRoutingModule {}
