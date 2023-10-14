import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
    NamedPriceItem,
    PricePipe,
    AppointmentComponent,
    CardComponent,
    ServicesTableComponent,
    AuthenticationService,
} from '../../../shared';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, Location, NgForOf, NgIf } from '@angular/common';
import { AppointmentManagementClientService } from '../../../appointment-managment';
import { EmailPipe } from './email.pipe';
import { DataService } from './data.service';
import { EndDatePipe } from './end-date.pipe';
import { AppointmentPreview } from '../../model';

@Component({
    selector: 'app-appointment-preview',
    standalone: true,
    templateUrl: './appointment-preview.component.html',
    styleUrls: [
        './appointment-preview.component.scss',
        '../../../shared/components/page/appointment/appointment.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        AppointmentComponent,
        CardComponent,
        EmailPipe,
        EndDatePipe,
        NgForOf,
        NgIf,
        PricePipe,
        ServicesTableComponent,
        DatePipe,
    ],
    providers: [AppointmentManagementClientService, DataService],
})
export class AppointmentPreviewComponent {
    readonly preview: AppointmentPreview = this.activatedRoute.snapshot.data['appointment'];
    readonly dataSource: NamedPriceItem[] = this.dataService.createDateSource(this.preview.services);
    readonly length: number = this.dataService.calculateLength(this.preview.services);

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly dataService: DataService,
        private readonly location: Location,
        private readonly appointmentManagementService: AppointmentManagementClientService,
        private readonly authentication: AuthenticationService
    ) {}

    get isAdmin(): boolean {
        return !!this.authentication.profile?.isAdmin;
    }

    cancelAppointment(): void {
        this.appointmentManagementService
            .cancelAppointment(this.preview.id)
            .subscribe(() => {
                this.location.back();
            });
    }
}
