import { Service } from './_services/services.service';
import { PriceItem } from './_services/utility/price.service';

export type AssociatedService = Service & { readonly appointmentServices: { readonly quantity: number } };

export interface NamedPriceItem extends PriceItem {
    readonly name: string;
}

export interface Profile {
    readonly id: string;
    readonly isAdmin: boolean;
    readonly name: string;
    readonly surname: string;
    readonly email: string;
    readonly photoUrl: string;
}
