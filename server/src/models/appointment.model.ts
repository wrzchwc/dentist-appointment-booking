import {
    BelongsToManyAddAssociationMixin,
    BelongsToManyAddAssociationsMixin,
    BelongsToManyGetAssociationsMixin,
    BelongsToManyRemoveAssociationMixin,
    BelongsToManySetAssociationsMixin,
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
} from 'sequelize';
import { Factor } from './factor.model';
import { Service } from './service.model';
import { User } from './user.model';
import { sequelizeInstance } from '../services';

export class Appointment extends Model<InferAttributes<Appointment>, InferCreationAttributes<Appointment>> {
    declare id: CreationOptional<string>;
    declare confirmed: CreationOptional<boolean>;
    declare estimatedPrice: Date | null;
    declare startsAt: Date | null;

    declare userId: ForeignKey<User['id']>;

    declare Services: NonAttribute<Service[]>;
    declare Factors: NonAttribute<Factor[]>;

    declare addService: BelongsToManyAddAssociationMixin<Service, string>;
    declare addServices: BelongsToManyAddAssociationsMixin<Service, string>;
    declare getServices: BelongsToManyGetAssociationsMixin<Service>;
    declare setService: BelongsToManySetAssociationsMixin<Service, string>;
    declare removeService: BelongsToManyRemoveAssociationMixin<Service, string>;
}

Appointment.init(
    {
        id: { type: DataTypes.UUID, primaryKey: true, allowNull: false, defaultValue: DataTypes.UUIDV4 },
        confirmed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        estimatedPrice: { type: DataTypes.FLOAT },
        startsAt: { type: DataTypes.DATE },
    },
    { sequelize: sequelizeInstance, tableName: 'appointments', timestamps: false }
);

Appointment.belongsToMany(Service, {
    through: 'appointments_services',
    foreignKey: 'appointmentId',
    timestamps: false,
});
Service.belongsToMany(Appointment, {
    through: 'appointments_services',
    foreignKey: 'serviceId',
    timestamps: false,
});

Appointment.hasMany(Factor, { foreignKey: 'appointmentId' });
Factor.belongsTo(Appointment, { foreignKey: 'appointmentId' });
