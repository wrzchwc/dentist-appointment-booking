import { Injectable } from '@angular/core';
import { HealthStateDescriptor, HealthStatePayload, Info } from '../model';

@Injectable({
    providedIn: 'root',
})
export class HealthStateService {
    private readonly state: Map<string, HealthStatePayload> = new Map();

    get facts(): string[] {
        return Array.from(this.state.values()).map(({ fact }) => fact);
    }

    get infos(): Info[] {
        return Array.from(this.state.entries()).map(([id, { additionalInfo }]) => ({ id, additionalInfo }));
    }

    store(descriptor: HealthStateDescriptor): void {
        this.state.set(descriptor.id, descriptor.payload);
    }

    update(info: Info): void {
        const value = this.state.get(info.id);
        if (value !== undefined) {
            value.additionalInfo = info.additionalInfo;
        }
    }

    remove(id: string): void {
        this.state.delete(id);
    }

    clear(): void {
        this.state.clear();
    }

    clearWomenOnly(): void {
        Array.from(this.state.entries())
            .filter(([, payload]) => payload.womenOnly)
            .map(([id]) => id)
            .forEach((identifier) => {
                this.state.delete(identifier);
            });
    }
}
