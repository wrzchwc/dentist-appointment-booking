import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Service, ServicesService } from 'src/app/shared/_services/services.service';

@Injectable({
    providedIn: 'root',
})
export class ServicesResolver implements Resolve<Service[]> {
    // eslint-disable-next-line no-unused-vars
    constructor(private services: ServicesService) {}

    resolve() {
        return this.services.getServices();
    }
}
