import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-appointments-wrapper',
    templateUrl: './appointments-wrapper.component.html',
    styleUrls: ['./appointments-wrapper.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentsWrapperComponent {}
