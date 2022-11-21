import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AdminModule } from '../admin/admin.module';
import { AppointmentComponent } from './appointment/appointment.component';
import { AppointmentsListComponent } from './appointments-list/appointments-list.component';
import { DatePickerComponent } from './date-buttons/date-picker.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
    declarations: [HeaderComponent, AppointmentComponent, AppointmentsListComponent, DatePickerComponent],
    exports: [HeaderComponent, AppointmentsListComponent, DatePickerComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        RouterLink,
        AdminModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
    ],
})
export class SharedModule {}
