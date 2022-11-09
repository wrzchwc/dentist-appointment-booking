import * as s from 'sequelize';
import { Appointment } from './appointment.model';
import { AppointmentFact } from './appointment-fact.model';
import { ModelError } from './model-error';
import { NonAttribute } from 'sequelize';
import { sequelizeInstance } from '../services';

type FactorFindOptions = Omit<s.FindOptions<s.InferAttributes<Factor>>, 'where'> | undefined;

export class Factor extends s.Model<s.InferAttributes<Factor>, s.InferCreationAttributes<Factor>> {
    declare id: s.CreationOptional<string>;
    declare additionalInfo: string | null;

    declare appointmentId: s.ForeignKey<Appointment['id']>;
    declare factId: s.ForeignKey<AppointmentFact['id']>;

    declare fact: NonAttribute<AppointmentFact>;

    static async find(id: string, options: FactorFindOptions) {
        const factor = await Factor.findByPk(id, options);
        if (!factor) {
            throw new ModelError('Factor not found', 404);
        }
        return factor;
    }
}

Factor.init(
    {
        id: { type: s.DataTypes.UUID, primaryKey: true, allowNull: false, defaultValue: s.DataTypes.UUIDV4 },
        additionalInfo: { type: s.DataTypes.STRING },
    },
    { sequelize: sequelizeInstance, tableName: 'factors', timestamps: false, modelName: 'factor' }
);
