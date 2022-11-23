import { Pipe, PipeTransform } from '@angular/core';
import { DisplayedColumn } from './table.component';

@Pipe({
    name: 'rowDef',
})
export class RowDefPipe implements PipeTransform {
    transform(values: DisplayedColumn[]): string[] {
        return values.map(({ property }) => property);
    }
}
