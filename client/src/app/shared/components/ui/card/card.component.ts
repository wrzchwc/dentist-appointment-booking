import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
    standalone: true,
    imports: [MatIconModule, MatCardModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
    @Input() title: string = '';
    @Input() icon: string = '';
}
