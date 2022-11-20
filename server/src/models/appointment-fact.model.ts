import * as s from 'sequelize';
import { AppointmentQuestion } from './appointment-question.model';
import { HealthSurvey } from './health-survey';
import { ModelError } from './model-error';
import { sequelizeInstance } from '../services';

export class AppointmentFact extends s.Model<
    s.InferAttributes<AppointmentFact>,
    s.InferCreationAttributes<AppointmentFact>
> {
    declare id: s.CreationOptional<string>;
    declare value: string;

    declare questionId: s.ForeignKey<AppointmentQuestion['id']>;

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
        id: { type: s.DataTypes.UUID, primaryKey: true, allowNull: false, defaultValue: s.DataTypes.UUIDV4 },
        value: { type: s.DataTypes.STRING, allowNull: false, unique: true },
    },
    { timestamps: false, sequelize: sequelizeInstance, tableName: 'appointment_facts', modelName: 'fact' }
);

AppointmentFact.hasMany(HealthSurvey);
HealthSurvey.belongsTo(AppointmentFact);
