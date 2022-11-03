import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { Factor } from './factor.model';
import { sequelizeInstance } from '../services';

export class AppointmentFact extends Model<InferAttributes<AppointmentFact>, InferCreationAttributes<AppointmentFact>> {
    declare id: CreationOptional<string>;
    declare value: string;
}

AppointmentFact.init(
    {
        id: { type: DataTypes.UUID, primaryKey: true, allowNull: false, defaultValue: DataTypes.UUIDV4 },
        value: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    { timestamps: false, sequelize: sequelizeInstance, tableName: 'appointment_facts' }
);

AppointmentFact.hasMany(Factor, { foreignKey: 'factId' });
Factor.belongsTo(AppointmentFact, { foreignKey: 'factId' });
