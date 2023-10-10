import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ServicesService } from 'src/app/shared/services/services.service';
import { Observable } from 'rxjs';
import { Service } from '../model';

@Injectable({
    providedIn: 'root',
})
export class ServicesResolver implements Resolve<Service[]> {
    constructor(private readonly servicesService: ServicesService) {}

    resolve(): Observable<Service[]> {
        return this.servicesService.getServices();
    }
}
