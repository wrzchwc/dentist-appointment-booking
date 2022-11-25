import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AppointmentsWrapperComponent } from './appointments-wrapper/appointments-wrapper.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CardComponent } from './card/card.component';
import { MatCardModule } from '@angular/material/card';
import { ServicesTableComponent } from './table/services-table.component';
import { MatTableModule } from '@angular/material/table';
import { RowDefinitionPipe } from './table/row-definition.pipe';
import { AppointmentsListComponent } from './appointments-list/appointments-list.component';
import { AppointmentPreviewComponent } from './appointment-preview/appointment-preview.component';
import { MatChipsModule } from '@angular/material/chips';
import { AppointmentsComponent } from './appointments/appointments.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { AppointmentTimesPipe } from './appointment-times.pipe';
import { UpdateStartDateComponent } from './update-start-date/update-start-date.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
    declarations: [
        HeaderComponent,
        AppointmentsWrapperComponent,
        CardComponent,
        ServicesTableComponent,
        RowDefinitionPipe,
        AppointmentsListComponent,
        AppointmentPreviewComponent,
        AppointmentsComponent,
        AppointmentComponent,
        AppointmentTimesPipe,
        UpdateStartDateComponent,
    ],
    exports: [
        HeaderComponent,
        AppointmentsWrapperComponent,
        CardComponent,
        RowDefinitionPipe,
        ServicesTableComponent,
        AppointmentsListComponent,
        AppointmentPreviewComponent,
        AppointmentsComponent,
        AppointmentComponent,
        AppointmentTimesPipe,
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        RouterLink,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCardModule,
        MatTableModule,
        MatChipsModule,
        MatDialogModule,
        MatSelectModule,
    ],
})
export class SharedModule {}
