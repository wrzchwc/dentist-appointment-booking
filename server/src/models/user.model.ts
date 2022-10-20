import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { Profile } from 'passport-google-oauth20';
import { sequelizeInstance } from '../services';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<string>;
    declare googleId: string;
    declare isAdmin: CreationOptional<boolean>;
    declare email?: string;
    declare name?: string;
    declare surname?: string;
    declare photoUrl?: string;

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
}

User.init(
    {
        id: { type: DataTypes.UUID, primaryKey: true, allowNull: false, defaultValue: DataTypes.UUIDV4 },
        googleId: { type: DataTypes.STRING, allowNull: false, unique: true },
        isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
        email: { type: DataTypes.STRING },
        name: { type: DataTypes.STRING },
        surname: { type: DataTypes.STRING },
        photoUrl: { type: DataTypes.STRING },
    },
    {
        timestamps: false,
        sequelize: sequelizeInstance,
        tableName: 'users',
    }
);
