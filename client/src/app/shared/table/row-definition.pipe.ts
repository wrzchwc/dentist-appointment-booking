import { Pipe, PipeTransform } from '@angular/core';
import { DisplayedColumn } from './services-table.component';

@Pipe({
    name: 'rowDefinition',
})
export class RowDefinitionPipe implements PipeTransform {
    transform(values: DisplayedColumn[]): string[] {
        return values.map(({ property }) => property);
    }
}
