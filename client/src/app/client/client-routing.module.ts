import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './client/client.component';
import { ClientAppointmentsComponent } from './client-appointments/client-appointments.component';
import { AppointmentBookingComponent } from './appointment-booking/appointment-booking/appointment-booking.component';
import { ServicesResolver } from '../shared/_resolvers/appointment-data/services.resolver';
import { AppointmentQuestionsResolver } from './appointment-booking/_resolvers/appointment-data/appointment-questions.resolver';

const routes: Routes = [
    { path: 'appointments', component: ClientAppointmentsComponent, title: 'Moje wizyty' },
    {
        path: 'booking',
        component: AppointmentBookingComponent,
        title: 'Rezerwacja wizyty',
        resolve: { services: ServicesResolver, appointmentQuestions: AppointmentQuestionsResolver },
    },
    { path: '', component: ClientComponent, title: 'Panel klienta' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ClientRoutingModule {}
