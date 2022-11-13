import { Request, Response } from 'express';
import { Service } from '../../models';

export async function getServices(request: Request, response: Response) {
    const services = await Service.findAll();
    response.status(200).json(services);
}
