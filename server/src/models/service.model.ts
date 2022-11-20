import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize';
import { AppointmentsServices } from './appointments-services.model';
import { ModelError } from './model-error';
import { sequelizeInstance } from '../services';

export class Service extends Model<InferAttributes<Service>, InferCreationAttributes<Service>> {
    declare id: CreationOptional<string>;
    declare name: string;
    declare price?: number;
    declare count: number;
    declare detail?: number;
    declare length?: number;

    declare appointment: NonAttribute<AppointmentsServices>;

    static async find(id: string) {
        const service = await Service.findByPk(id);

        if (!service) {
            throw new ModelError('Service not found', 404);
        }

        return service;
    }
}

Service.init(
    {
        id: { type: DataTypes.UUID, primaryKey: true, allowNull: false, defaultValue: DataTypes.UUIDV4 },
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
        price: { type: DataTypes.FLOAT },
        count: { type: DataTypes.SMALLINT, allowNull: false },
        detail: { type: DataTypes.STRING },
        length: { type: DataTypes.SMALLINT },
    },
    { timestamps: false, sequelize: sequelizeInstance, tableName: 'services', modelName: 'service' }
);
