import { InferCreationAttributes } from 'sequelize';
import { Service } from '../../src/models';
import { join } from 'path';
import { readFileSync } from 'fs';

async function loadServicesData() {
    const path = join(__dirname, '..', '..', '..', 'data', 'services.json');
    const services: InferCreationAttributes<Service>[] = JSON.parse(readFileSync(path, 'utf8'));
    services.forEach((service) => {
        const { name, price, detail, count, length } = service;
        Service.findOrCreate({ where: { name: service.name }, defaults: { name, price, detail, count, length } });
    });
}

// eslint-disable-next-line no-console
loadServicesData().catch(console.error);
