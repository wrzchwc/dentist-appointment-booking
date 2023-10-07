import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UpdatePriceComponent } from '../../ui/update-price/update-price.component';
import { filter, Subject, takeUntil } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { AppointmentTimesPipe } from '../../../../shared/pipes/appointment-times.pipe';
import { NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Service } from '../../../../shared/model';
import { TooltipPipe } from '../../../../shared/pipes/tooltip.pipe';

@Component({
    selector: 'app-price-list',
    templateUrl: './price-list.component.html',
    styleUrls: ['./price-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatCardModule,
        MatIconModule,
        MatTooltipModule,
        MatMenuModule,
        AppointmentTimesPipe,
        NgForOf,
        NgIf,
        MatButtonModule,
        TooltipPipe
    ],
    standalone: true,
})
export class PriceListComponent {
    services: Service[] = this.route.snapshot.data['services'];

    private readonly dialogConfig: MatDialogConfig = { autoFocus: true };
    private readonly destroy$: Subject<void> = new Subject();

    constructor(
        private readonly route: ActivatedRoute,
        private readonly dialog: MatDialog
    ) {}

    handlePriceUpdate(service: Service) {
        this.dialogConfig.data = { id: service.id, price: service.price, name: service.name };
        this.dialog
            .open(UpdatePriceComponent, this.dialogConfig)
            .afterClosed()
            .pipe(
                takeUntil(this.destroy$),
                filter((value) => typeof value === 'number')
            )
            .subscribe((price) => {
                service.price = price;
            });
    }
}
