import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TooltipService } from '../../shared/_services/tooltip.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UpdatePriceComponent } from '../update-price/update-price.component';
import { filter, Subject, takeUntil } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { AppointmentTimesPipe } from '../../shared/appointment-times.pipe';
import { NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Service } from '../../shared/model';

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
    ],
    standalone: true,
})
export class PriceListComponent implements OnInit {
    services: Service[] = [];

    private readonly dialogConfig: MatDialogConfig = { autoFocus: true };
    private readonly destroy$ = new Subject<void>();

    constructor(
        private readonly route: ActivatedRoute,
        public readonly tooltipService: TooltipService,
        private readonly dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.services = this.route.snapshot.data['services'];
    }

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
