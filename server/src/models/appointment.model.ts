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
    declare startsAt: Date;

    declare userId: s.ForeignKey<User['id']>;

    declare services: s.NonAttribute<Service[]>;
    declare facts: s.NonAttribute<AppointmentFact[]>;

    declare createAppointment: s.HasManyCreateAssociationMixin<Appointment>;

    declare addFact: s.BelongsToManyAddAssociationMixin<AppointmentFact, string>;
    declare addService: s.BelongsToManyAddAssociationMixin<Service, string>;

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
        startsAt: { type: s.DataTypes.DATE, allowNull: false },
    },
    { sequelize: sequelizeInstance, tableName: 'appointments', timestamps: false, modelName: 'appointment' }
);

Appointment.belongsToMany(Service, { through: AppointmentsServices, timestamps: false });
Service.belongsToMany(Appointment, { through: AppointmentsServices, timestamps: false });

Appointment.belongsToMany(AppointmentFact, { through: HealthSurvey, timestamps: false });
AppointmentFact.belongsToMany(Appointment, { through: HealthSurvey, timestamps: false });
