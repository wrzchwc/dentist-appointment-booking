import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AppointmentsWrapperComponent } from './appointments-wrapper/appointments-wrapper.component';
import { DatePickerComponent } from './date-buttons/date-picker.component';
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

@NgModule({
    declarations: [
        HeaderComponent,
        AppointmentsWrapperComponent,
        DatePickerComponent,
        CardComponent,
        ServicesTableComponent,
        RowDefinitionPipe,
        AppointmentsListComponent,
    ],
    exports: [
        HeaderComponent,
        AppointmentsWrapperComponent,
        DatePickerComponent,
        CardComponent,
        RowDefinitionPipe,
        ServicesTableComponent,
        AppointmentsListComponent,
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
    ],
})
export class SharedModule {}
