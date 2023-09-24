import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'app-appointments-list',
    templateUrl: './appointments-list.component.html',
    styleUrls: ['./appointments-list.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentsListComponent {
    @Input() title: string = '';
}
