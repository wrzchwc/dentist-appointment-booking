import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AdminModule } from '../admin/admin.module';
import { AppointmentComponent } from './appointment/appointment.component';
import { AppointmentsListComponent } from './appointments-list/appointments-list.component';

@NgModule({
    declarations: [HeaderComponent, AppointmentComponent, AppointmentsListComponent],
    exports: [HeaderComponent, AppointmentsListComponent],
    imports: [CommonModule, MatButtonModule, MatIconModule, RouterLink, AdminModule],
})
export class SharedModule {}
