import { Request, Response } from 'express';

export function signOut(request: Request, response: Response) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    request.logout(() => {});
    response.redirect('/');
}
