import { Component, Input } from '@angular/core';
import { PriceItem } from '../_services/utility/price.service';

@Component({
    selector: 'app-services-table',
    templateUrl: './services-table.component.html',
    styleUrls: ['./services-table.component.scss'],
})
export class ServicesTableComponent {
    @Input() dataSource: NamedPriceItem[];
    readonly displayedColumns: DisplayedColumn[];

    constructor() {
        this.dataSource = [];
        this.displayedColumns = [
            { label: 'usługa', property: 'name' },
            { label: 'liczba', property: 'quantity' },
            { label: 'wartość', property: 'price' },
        ];
    }
}

export interface NamedPriceItem extends PriceItem {
    name: string;
}

export interface DisplayedColumn {
    property: string;
    label: string;
}
