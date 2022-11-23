import { Component, Input } from '@angular/core';
import { PriceItem } from '../_services/utility/price.service';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent {
    @Input() dataSource: NamedPriceItem[];
    @Input() displayedColumns: DisplayedColumn[];

    constructor() {
        this.dataSource = [];
        this.displayedColumns = [];
    }
}

export interface DisplayedColumn {
    property: string;
    label: string;
}

export interface NamedPriceItem extends PriceItem {
    name: string;
}
