import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PriceService } from '../../shared/services/price.service';
import { ClientAppointmentService } from './client-appointment.service';
import { Subject, takeUntil } from 'rxjs';
import { DatePipe, Location, NgIf } from '@angular/common';
import { AppointmentService } from '../../shared/components/page/appointment/appointment.service';
import { Appointment } from '../model';
import { AppointmentComponent } from '../../shared/components/page/appointment/appointment.component';
import { CardComponent } from '../../shared/components/ui/card/card.component';
import { ServicesTableComponent } from '../../shared/components/ui/services-table/services-table.component';
import { NamedPriceItem } from '../../shared/model';

@Component({
    selector: 'app-client-appointment',
    templateUrl: './client-appointment.component.html',
    styleUrls: ['./client-appointment.component.scss', '../../shared/components/page/appointment/appointment.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgIf, AppointmentComponent, CardComponent, ServicesTableComponent, DatePipe],
    standalone: true,
})
export class ClientAppointmentComponent implements OnDestroy {
    readonly appointment: Appointment;
    readonly price: number;
    readonly cancelable: boolean;
    readonly length: number;
    readonly endsAt: Date;
    readonly dataSource: NamedPriceItem[];
    private readonly onDestroy: Subject<void>;

    constructor(
        private activatedRoute: ActivatedRoute,
        private priceService: PriceService,
        private clientAppointmentService: ClientAppointmentService,
        private location: Location,
        private appointmentService: AppointmentService
    ) {
        this.appointment = activatedRoute.snapshot.data['appointment'];
        this.dataSource = appointmentService.createDateSource(this.appointment.services);
        this.price = priceService.calculateTotalPrice(this.dataSource);
        this.length = appointmentService.calculateLength(this.appointment.services);
        this.cancelable = appointmentService.isCancelable(this.appointment.startsAt);
        this.endsAt = appointmentService.calculateEndsAt(this.appointment.startsAt, this.length);
        this.onDestroy = new Subject<void>();
    }

    ngOnDestroy(): void {
        this.onDestroy.next();
    }

    handleCancel() {
        this.clientAppointmentService
            .cancelAppointment(this.appointment.id)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(() => {
                this.location.back();
            });
    }
}
