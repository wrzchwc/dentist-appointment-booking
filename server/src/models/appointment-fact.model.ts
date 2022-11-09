import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    HasManyCreateAssociationMixin,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from 'sequelize';
import { AppointmentQuestion } from './appointment-question.model';
import { Factor } from './factor.model';
import { ModelError } from './model-error';
import { sequelizeInstance } from '../services';

export class AppointmentFact extends Model<InferAttributes<AppointmentFact>, InferCreationAttributes<AppointmentFact>> {
    declare id: CreationOptional<string>;
    declare value: string;

    declare questionId: ForeignKey<AppointmentQuestion['id']>;

    declare createFactor: HasManyCreateAssociationMixin<Factor>;

    static async find(id: string) {
        const fact = await AppointmentFact.findByPk(id);

        if (!fact) {
            throw new ModelError('Fact not found', 404);
        }

        return fact;
    }
}

AppointmentFact.init(
    {
        id: { type: DataTypes.UUID, primaryKey: true, allowNull: false, defaultValue: DataTypes.UUIDV4 },
        value: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    { timestamps: false, sequelize: sequelizeInstance, tableName: 'appointment_facts', modelName: 'fact' }
);

AppointmentFact.hasMany(Factor);
Factor.belongsTo(AppointmentFact);
