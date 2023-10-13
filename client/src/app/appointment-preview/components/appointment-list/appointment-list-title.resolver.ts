import { ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '../../../shared';

enum Title {
    ADMIN = 'Wizyty',
    CLIENT = 'Moje wizyty',
}

export function appointmentListTitleResolver(route: ActivatedRouteSnapshot): string {
    return inject(AuthenticationService).profile?.isAdmin ? Title.ADMIN : Title.CLIENT;
}
