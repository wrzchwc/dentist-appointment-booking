import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelizeInstance } from '../services';

export class Service extends Model<InferAttributes<Service>, InferCreationAttributes<Service>> {
    declare id: CreationOptional<string>;
    declare name: string;
    declare price?: number;
    declare count: number;
    declare detail?: number;
    declare length?: number;
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
    { timestamps: false, sequelize: sequelizeInstance, tableName: 'services' }
);
