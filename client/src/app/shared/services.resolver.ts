import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Service, ServicesService } from 'src/app/shared/_services/services.service';

@Injectable({
    providedIn: 'root',
})
export class ServicesResolver implements Resolve<Service[]> {
    constructor(private readonly servicesService: ServicesService) {}

    resolve() {
        return this.servicesService.getServices();
    }
}
