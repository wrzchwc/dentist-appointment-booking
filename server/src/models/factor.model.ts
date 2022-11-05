import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelizeInstance } from '../services';

export class Factor extends Model<InferAttributes<Factor>, InferCreationAttributes<Factor>> {
    declare id: CreationOptional<string>;
    declare additionalInfo: string | null;
}

Factor.init(
    {
        id: { type: DataTypes.UUID, primaryKey: true, allowNull: false, defaultValue: DataTypes.UUIDV4 },
        additionalInfo: { type: DataTypes.STRING },
    },
    { sequelize: sequelizeInstance, tableName: 'factors', timestamps: false, modelName: 'factor' }
);
