import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentBookingComponent } from './appointment-booking/appointment-booking.component';
import { ServicesResolver } from '../shared/_resolvers/appointment-data/services.resolver';
import { AppointmentQuestionsResolver } from './_resolvers/appointment-data/appointment-questions.resolver';

const routes: Routes = [
    {
        path: '',
        component: AppointmentBookingComponent,
        title: 'Rezerwacja wizyty',
        resolve: { services: ServicesResolver, appointmentQuestions: AppointmentQuestionsResolver },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AppointmentBookingRoutingModule {}
