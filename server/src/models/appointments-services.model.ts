import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { Appointment } from './appointment.model';
import { sequelizeInstance } from '../services';

export class AppointmentsServices extends Model<
    InferAttributes<AppointmentsServices>,
    InferCreationAttributes<AppointmentsServices>
> {
    declare quantity: CreationOptional<number>;
    declare appointmentId: ForeignKey<Appointment>;
    declare serviceId: ForeignKey<Appointment>;
}

AppointmentsServices.init(
    {
        quantity: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
        timestamps: false,
        tableName: 'appointments_services',
        sequelize: sequelizeInstance,
        modelName: 'appointmentServices',
    }
);
