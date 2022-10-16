import { NextFunction, Request, Response } from 'express';

export function authentication(request: Request, response: Response, next: NextFunction) {
    if (!request.user) {
        response.statusCode = 401;
        return response.json({ error: 'User not authenticated!' });
    }
    next();
}
