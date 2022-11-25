import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Service } from '../../shared/_services/services.service';
import { TooltipService } from '../../shared/_services/tooltip.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UpdatePriceComponent } from '../update-price/update-price.component';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-price-list',
    templateUrl: './price-list.component.html',
    styleUrls: ['./price-list.component.scss'],
})
export class PriceListComponent {
    services: Service[];
    private readonly dialogConfig: MatDialogConfig;
    private readonly onDestroy: Subject<void>;

    // eslint-disable-next-line no-unused-vars
    constructor(private route: ActivatedRoute, public tooltipService: TooltipService, private dialog: MatDialog) {
        this.services = route.snapshot.data['services'];
        this.dialogConfig = { autoFocus: true };
        this.onDestroy = new Subject<void>();
    }

    handlePriceUpdate(service: Service) {
        this.dialogConfig.data = { id: service.id, price: service.price, name: service.name };
        this.dialog
            .open(UpdatePriceComponent, this.dialogConfig)
            .afterClosed()
            .pipe(
                takeUntil(this.onDestroy),
                filter((value) => typeof value === 'number')
            )
            .subscribe((price) => {
                service.price = price;
            });
    }
}
