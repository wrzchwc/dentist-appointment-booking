/*eslint no-unused-vars: 0*/
import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl } from '@angular/forms';
import { UpdatePriceService } from './update-price.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-update-price',
    templateUrl: './update-price.component.html',
    styleUrls: ['./update-price.component.scss'],
})
export class UpdatePriceComponent implements OnDestroy {
    readonly priceControl: FormControl<number>;
    private readonly onDestroy: Subject<void>;

    constructor(
        private dialogRef: MatDialogRef<UpdatePriceComponent>,
        @Inject(MAT_DIALOG_DATA) public data: UpdatePriceDialogData,
        private builder: FormBuilder,
        private service: UpdatePriceService
    ) {
        this.priceControl = builder.control(data.price, { nonNullable: true });
        this.onDestroy = new Subject<void>();
    }

    ngOnDestroy(): void {
        this.onDestroy.next();
    }

    handleUpdate() {
        this.service
            .updateServicePrice(this.data.id, this.priceControl.value)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(() => {
                this.dialogRef.close(this.priceControl.value);
            });
    }

    handleCancel() {
        this.dialogRef.close();
    }
}

interface UpdatePriceDialogData {
    id: string;
    name: string;
    price: number;
}
