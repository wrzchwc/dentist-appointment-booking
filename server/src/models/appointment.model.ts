import * as s from 'sequelize';
import { AppointmentFact } from './appointment-fact.model';
import { AppointmentsServices } from './appointments-services.model';
import { HealthSurvey } from './health-survey';
import { ModelError } from './model-error';
import { Service } from './service.model';
import { User } from './user.model';
import { sequelizeInstance } from '../services';

export class Appointment extends s.Model<s.InferAttributes<Appointment>, s.InferCreationAttributes<Appointment>> {
    declare id: s.CreationOptional<string>;
    declare confirmed: s.CreationOptional<boolean>;
    declare estimatedPrice: s.CreationOptional<number>;
    declare startsAt: Date | null;

    declare userId: s.ForeignKey<User['id']>;

    declare services: s.NonAttribute<Service[]>;
    declare facts: s.NonAttribute<AppointmentFact[]>;

    declare addService: s.BelongsToManyAddAssociationMixin<Service, string>;
    declare addFact: s.BelongsToManyAddAssociationMixin<AppointmentFact, string>;
    declare hasService: s.BelongsToManyHasAssociationMixin<Service, string>;
    declare removeService: s.BelongsToManyRemoveAssociationMixin<Service, string>;
    declare removeFact: s.BelongsToManyRemoveAssociationMixin<AppointmentFact, string>;

    static async find(id: string) {
        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            throw new ModelError('Appointment not found', 404);
        }
        return appointment;
    }
}

Appointment.init(
    {
        id: { type: s.DataTypes.UUID, primaryKey: true, allowNull: false, defaultValue: s.DataTypes.UUIDV4 },
        confirmed: { type: s.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        estimatedPrice: { type: s.DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        startsAt: { type: s.DataTypes.DATE },
    },
    { sequelize: sequelizeInstance, tableName: 'appointments', timestamps: false, modelName: 'appointment' }
);

Appointment.belongsToMany(Service, { through: AppointmentsServices, timestamps: false });
Service.belongsToMany(Appointment, { through: AppointmentsServices, timestamps: false });

Appointment.belongsToMany(AppointmentFact, { through: HealthSurvey, timestamps: false });
AppointmentFact.belongsToMany(Appointment, { through: HealthSurvey, timestamps: false });
