import {
    BelongsToManyAddAssociationMixin,
    BelongsToManyHasAssociationMixin,
    BelongsToManyRemoveAssociationMixin,
    CreationOptional,
    DataTypes,
    ForeignKey,
    HasManyAddAssociationMixin,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
} from 'sequelize';
import { AppointmentsServices } from './appointments-services.model';
import { Factor } from './factor.model';
import { ModelError } from './model-error';
import { Service } from './service.model';
import { User } from './user.model';
import { sequelizeInstance } from '../services';

export class Appointment extends Model<InferAttributes<Appointment>, InferCreationAttributes<Appointment>> {
    declare id: CreationOptional<string>;
    declare confirmed: CreationOptional<boolean>;
    declare estimatedPrice: CreationOptional<number>;
    declare startsAt: Date | null;

    declare userId: ForeignKey<User['id']>;

    declare services: NonAttribute<Service[]>;
    declare factors: NonAttribute<Factor[]>;

    declare addService: BelongsToManyAddAssociationMixin<Service, string>;
    declare hasService: BelongsToManyHasAssociationMixin<Service, string>;
    declare removeService: BelongsToManyRemoveAssociationMixin<Service, string>;

    declare addFactor: HasManyAddAssociationMixin<Factor, string>;

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
        id: { type: DataTypes.UUID, primaryKey: true, allowNull: false, defaultValue: DataTypes.UUIDV4 },
        confirmed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        estimatedPrice: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        startsAt: { type: DataTypes.DATE },
    },
    { sequelize: sequelizeInstance, tableName: 'appointments', timestamps: false, modelName: 'appointment' }
);

Appointment.belongsToMany(Service, {
    through: AppointmentsServices,
    timestamps: false,
});
Service.belongsToMany(Appointment, {
    through: AppointmentsServices,
    timestamps: false,
});

Appointment.hasMany(Factor);
Factor.belongsTo(Appointment);
