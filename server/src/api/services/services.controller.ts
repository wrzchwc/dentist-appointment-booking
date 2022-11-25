import { Request, Response } from 'express';
import { Service } from '../../models';
import { UpdateService } from './services.requests';

export async function getServices(request: Request, response: Response) {
    let services: Service[];

    try {
        services = await Service.findAll({ where: { count: 1 }, order: [['price', 'ASC']] });
    } catch (e) {
        return response.status(500).json({ error: 'Operation failed' });
    }

    response.status(200).json(services);
}

export async function updateService({ body, params }: UpdateService, response: Response) {
    let affectedNumber: number;
    let affectedServices: Service[];

    try {
        [affectedNumber, affectedServices] = await Service.update(body, {
            where: { id: params.serviceId },
            returning: true,
        });
    } catch (e) {
        return response.status(500).json({ error: 'Operation failed' });
    }

    response.status(200).json(affectedNumber > 0 ? affectedServices.at(0) : {});
}
