import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentBookingComponent } from './appointment-booking/appointment-booking.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ServiceCardComponent } from './service-card/service-card.component';
import { AppointmentServicesComponent } from './appointment-services/appointment-services.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AppointmentTimesPipe } from './service-card/appointment-times.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HealthStateComponent } from './health-state/health-state.component';
import { MatRadioModule } from '@angular/material/radio';
import { HealthQuestionComponent } from './health-question/health-question.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateComponent } from './date/date.component';
import { TimeCardComponent } from './time-card/time-card.component';
import { AppointmentBookingRoutingModule } from './appointment-booking-routing.module';
import { SummaryComponent } from './summary/summary.component';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        AppointmentBookingComponent,
        ServiceCardComponent,
        AppointmentServicesComponent,
        AppointmentTimesPipe,
        HealthStateComponent,
        HealthQuestionComponent,
        DateComponent,
        TimeCardComponent,
        SummaryComponent,
    ],
    imports: [
        CommonModule,
        AppointmentBookingRoutingModule,
        MatStepperModule,
        MatButtonModule,
        RouterLink,
        MatCardModule,
        MatIconModule,
        MatTooltipModule,
        MatRadioModule,
        MatSlideToggleModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        SharedModule,
    ],
})
export class AppointmentBookingModule {}
