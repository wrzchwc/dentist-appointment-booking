import { ChangeDetectionStrategy, Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { UpdatePriceService } from './update-price.service';
import { Subject, takeUntil } from 'rxjs';
import { UpdatePriceDialogData } from './update-price.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-update-price',
    templateUrl: './update-price.component.html',
    styleUrls: ['./update-price.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatDialogModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
    standalone: true,
})
export class UpdatePriceComponent implements OnDestroy {
    readonly priceControl: FormControl<number> = this.builder.control<number>(this.data.price, { nonNullable: true });

    private readonly destroy$ = new Subject<void>();

    constructor(
        private readonly dialogRef: MatDialogRef<UpdatePriceComponent>,
        @Inject(MAT_DIALOG_DATA) private readonly data: UpdatePriceDialogData,
        private readonly builder: FormBuilder,
        private readonly service: UpdatePriceService
    ) {}

    ngOnDestroy(): void {
        this.destroy$.next();
    }

    get name(): string {
        return this.data.name;
    }

    updatePrice(): void {
        this.service
            .updateServicePrice(this.data.id, this.priceControl.value)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.dialogRef.close(this.priceControl.value);
            });
    }

    cancel(): void {
        this.dialogRef.close();
    }
}
