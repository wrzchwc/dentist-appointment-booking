interface Identifiable {
    id: string;
}

export interface AppointmentQuestion extends Identifiable {
    readonly question: string;
    readonly subquestion: string | null;
    readonly womenOnly: boolean;
    readonly fact: Fact;
}

interface Fact extends Identifiable {
    readonly value: string;
}

export interface HealthStateDescriptor extends Identifiable {
    readonly payload: HealthStatePayload;
}

export interface Info extends Identifiable {
    additionalInfo?: string;
}

export interface HealthStatePayload {
    readonly fact: string;
    readonly womenOnly: boolean;
    additionalInfo?: string;
}

export interface Quantity extends Identifiable {
    readonly quantity: number;
}
