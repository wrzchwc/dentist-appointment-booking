import { Request, Response } from 'express';
import { Service } from '../../models';

export async function getServices(request: Request, response: Response) {
    let services: Service[];

    try {
        services = await Service.findAll({ where: { count: 1 }, order: [['price', 'ASC']] });
    } catch (e) {
        return response.status(500).json({ error: 'Operation failed' });
    }

    response.status(200).json(services);
}
