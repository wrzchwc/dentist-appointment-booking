import { Request, Response } from 'express';

export function signOut(request: Request, response: Response) {
    request.logout(() => {
        response.redirect('/');
    });
}
