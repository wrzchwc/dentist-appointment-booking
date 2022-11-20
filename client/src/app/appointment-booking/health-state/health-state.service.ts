import { Injectable } from '@angular/core';

export interface HealthStateDescriptor {
    id: string;
    payload: HealthStatePayload;
}

interface HealthStatePayload {
    fact: string;
    additionalInfo?: string;
}

export interface IdInfo {
    id: string;
    additionalInfo?: string;
}

@Injectable({
    providedIn: 'root',
})
export class HealthStateService {
    private readonly state: Map<string, HealthStatePayload>;

    constructor() {
        this.state = new Map<string, HealthStatePayload>();
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
}
