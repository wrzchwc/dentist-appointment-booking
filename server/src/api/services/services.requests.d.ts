import { Request } from 'express';

export interface UpdateService extends Request {
    params: {
        serviceId: string;
    };
    body: {
        price?: number;
    };
}
