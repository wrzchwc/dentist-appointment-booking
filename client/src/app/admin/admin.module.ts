import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import { AdminAppointmentsComponent } from './admin-appointments/admin-appointments.component';
import { PriceListComponent } from './price-list/price-list.component';
import { MatIconModule } from '@angular/material/icon';
import { AdminAppointmentComponent } from './admin-appointment/admin-appointment.component';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { UpdatePriceComponent } from './update-price/update-price.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { AppointmentTimesPipe } from '../shared/appointment-times.pipe';
import { AppointmentComponent } from '../shared/appointment/appointment.component';
import { AppointmentPreviewComponent } from '../shared/appointment-preview/appointment-preview.component';
import { AppointmentsListComponent } from '../shared/appointments-list/appointments-list.component';
import { AppointmentsWrapperComponent } from '../shared/appointments-wrapper/appointments-wrapper.component';
import { CardComponent } from '../shared/card/card.component';
import { AppointmentsComponent } from '../shared/appointments/appointments.component';
import { ServicesTableComponent } from '../shared/services-table/services-table.component';

@NgModule({
    declarations: [
        AdminComponent,
        AdminAppointmentsComponent,
        PriceListComponent,
        AdminAppointmentComponent,
        UpdatePriceComponent,
    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        MatIconModule,
        MatCardModule,
        MatTooltipModule,
        MatButtonModule,
        MatMenuModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        AppointmentTimesPipe,
        AppointmentComponent,
        AppointmentPreviewComponent,
        AppointmentsListComponent,
        AppointmentsWrapperComponent,
        CardComponent,
        AppointmentsComponent,
        ServicesTableComponent,
    ],
})
export class AdminModule {}
