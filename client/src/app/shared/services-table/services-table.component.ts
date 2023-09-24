import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DisplayedColumn } from './services-table.model';
import { NamedPriceItem } from '../shared.model';
import { NgForOf, UpperCasePipe } from '@angular/common';
import { RowDefinitionPipe } from './row-definition.pipe';
import { MatTableModule } from '@angular/material/table';

@Component({
    selector: 'app-services-table',
    templateUrl: 'services-table.component.html',
    styleUrls: ['./services-table.component.scss'],
    standalone: true,
    imports: [NgForOf, RowDefinitionPipe, MatTableModule, UpperCasePipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesTableComponent {
    @Input() dataSource: NamedPriceItem[] = [];

    private readonly _displayedColumns: DisplayedColumn[] = [
        { label: 'usługa', property: 'name' },
        { label: 'liczba', property: 'quantity' },
        { label: 'wartość', property: 'price' },
    ];
    get displayedColumns(): DisplayedColumn[] {
        return this._displayedColumns;
    }
}
