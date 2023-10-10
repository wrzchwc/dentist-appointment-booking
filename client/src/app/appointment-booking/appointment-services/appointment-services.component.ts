import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgForOf } from '@angular/common';
import { ServiceCardComponent } from '../service-card/service-card.component';
import { Service } from '../../shared';

@Component({
    selector: 'app-appointment-services',
    templateUrl: './appointment-services.component.html',
    styleUrls: ['./appointment-services.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgForOf, ServiceCardComponent],
    standalone: true,
})
export class AppointmentServicesComponent {
    @Input() services: Service[] = [];
}
