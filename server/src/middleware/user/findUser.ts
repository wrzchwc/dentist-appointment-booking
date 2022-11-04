import { NextFunction, Request, Response } from 'express';
import { User } from '../../models';

export async function findUser(request: Request, response: Response, next: NextFunction) {
    let user: User | null;

    try {
        user = await User.findByPk((request.user as User).id);
    } catch (e) {
        response.statusCode = 500;
        return response.json({ error: 'Operation failed' });
    }

    if (!user) {
        response.statusCode = 404;
        return response.json({ error: 'User not found' });
    }

    next();
}
