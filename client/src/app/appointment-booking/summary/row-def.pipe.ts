import { Pipe, PipeTransform } from '@angular/core';

export interface ColumnDef {
    property: string;
    label: string;
}

@Pipe({
    name: 'rowDef',
})
export class RowDefPipe implements PipeTransform {
    transform(values: ColumnDef[]): string[] {
        return values.map(({ property }) => property);
    }
}
