import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ServicesService } from 'src/app/client/services/services.service';
import { Service } from '../model';

@Injectable({
    providedIn: 'root',
})
export class ServicesResolver implements Resolve<Service[]> {
    constructor(private readonly servicesService: ServicesService) {}

    resolve() {
        return this.servicesService.getServices();
    }
}
