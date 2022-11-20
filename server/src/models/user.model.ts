import * as s from 'sequelize';
import { Appointment } from './appointment.model';
import { ModelError } from './model-error';
import { Profile } from 'passport-google-oauth20';
import { sequelizeInstance } from '../services';

export class User extends s.Model<s.InferAttributes<User>, s.InferCreationAttributes<User>> {
    declare id: s.CreationOptional<string>;
    declare googleId: string;
    declare isAdmin: s.CreationOptional<boolean>;
    declare email?: string;
    declare name?: string;
    declare surname?: string;
    declare photoUrl?: string;

    declare createAppointment: s.HasManyCreateAssociationMixin<Appointment>;
    declare getAppointments: s.HasManyGetAssociationsMixin<Appointment>;

    static async register(userProfile: Profile) {
        const googleId = userProfile.id;
        const name = userProfile.name?.givenName;
        const surname = userProfile.name?.familyName;
        const photoUrl = userProfile.photos?.at(0)?.value;
        const email = userProfile.emails?.find(({ verified }) => verified)?.value;
        return await User.findOrCreate({
            where: { googleId },
            defaults: { googleId, name, surname, photoUrl, email },
        });
    }

    static async find(id: string): Promise<User> {
        const user = await User.findByPk(id);

        if (user) {
            return user;
        }

        throw new ModelError('User not found', 404);
    }
}

User.init(
    {
        id: { type: s.DataTypes.UUID, primaryKey: true, allowNull: false, defaultValue: s.DataTypes.UUIDV4 },
        googleId: { type: s.DataTypes.STRING, allowNull: false, unique: true },
        isAdmin: { type: s.DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
        email: { type: s.DataTypes.STRING },
        name: { type: s.DataTypes.STRING },
        surname: { type: s.DataTypes.STRING },
        photoUrl: { type: s.DataTypes.STRING },
    },
    { timestamps: false, sequelize: sequelizeInstance, tableName: 'users', modelName: 'user' }
);

User.hasMany(Appointment, { onDelete: 'CASCADE' });
Appointment.belongsTo(User);
