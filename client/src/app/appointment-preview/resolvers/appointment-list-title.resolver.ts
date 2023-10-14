import { inject } from '@angular/core';
import { AuthenticationService } from '../../shared';

enum Title {
    ADMIN = 'Wizyty',
    CLIENT = 'Moje wizyty',
}

export function appointmentListTitleResolver(): string {
    return inject(AuthenticationService).profile?.isAdmin ? Title.ADMIN : Title.CLIENT;
}
