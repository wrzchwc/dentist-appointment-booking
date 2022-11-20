import { Injectable } from '@angular/core';
import { IdInfo } from '../../shared/_services/appointments/appointments.service';

export interface HealthStateDescriptor {
    id: string;
    payload: HealthStatePayload;
}

interface HealthStatePayload {
    fact: string;
    additionalInfo?: string;
    womenOnly: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class HealthStateService {
    private readonly state: Map<string, HealthStatePayload>;

    constructor() {
        this.state = new Map<string, HealthStatePayload>();
    }

    get facts(): string[] {
        return Array.from(this.state.values()).map(({ fact }) => fact);
    }

    store(descriptor: HealthStateDescriptor) {
        this.state.set(descriptor.id, descriptor.payload);
    }

    update({ id, additionalInfo }: IdInfo) {
        const value = this.state.get(id);
        if (value !== undefined) {
            value.additionalInfo = additionalInfo;
        }
    }

    remove(id: string) {
        this.state.delete(id);
    }

    clear() {
        this.state.clear();
    }

    clearWomenOnly() {
        const identifiers = Array.from(this.state.entries()).filter(this.filterForWomenOnly).map(this.mapToId);
        identifiers.forEach((identifier) => {
            this.state.delete(identifier);
        });
    }

    private filterForWomenOnly([, { womenOnly }]: [string, HealthStatePayload]): boolean {
        return womenOnly;
    }

    private mapToId([id]: [string, HealthStatePayload]): string {
        return id;
    }

    getIdInfoItems(): IdInfo[] {
        return Array.from(this.state.entries()).map(([id, { additionalInfo }]) => ({ id, additionalInfo }));
    }
}
