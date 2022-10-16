import { NextFunction, Request, Response } from 'express';

export function authorisation(request: Request, response: Response, next: NextFunction) {
    if (!request.session?.passport?.user?.isAdmin) {
        response.statusCode = 403;
        return response.json({ error: 'User unauthorized!' });
    }
    next();
}
