export type Service = StandardService | ExceptionalPriceService;

interface StandardService extends ServiceBase {
    price: number;
    detail: null;
}

interface ExceptionalPriceService extends ServiceBase {
    price: null;
    detail: 'A';
}

interface ServiceBase {
    id: string;
    name: string;
    count: 1;
    length: number;
}

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

export interface PriceItem {
    price: number | null;
    detail: 'A' | 'B' | 'C' | null;
    quantity: number;
}
