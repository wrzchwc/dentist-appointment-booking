import { Request, Response } from 'express';
import { SessionData } from '../../../config';
import { User } from '../../../models';

export async function getMe(request: Request, response: Response) {
    const attributes = ['id', 'isAdmin', 'name', 'surname', 'email', 'photoUrl'];
    const user = await User.findByPk((request.user as SessionData).id, { attributes });
    if (!user) {
        return response.status(404).json({ error: 'User does not exist' });
    }
    response.status(200).json(user?.toJSON());
}
