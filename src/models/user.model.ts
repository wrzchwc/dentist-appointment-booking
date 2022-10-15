import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelizeInstance } from '../services';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<string>;
    declare googleId: string;
    declare isAdmin: CreationOptional<boolean>;
    declare email?: string;
    declare name?: string;
    declare surname?: string;
    declare photoUrl?: string;
}

User.init(
    {
        id: { type: DataTypes.UUID, primaryKey: true, allowNull: false, defaultValue: DataTypes.UUIDV4 },
        googleId: { type: DataTypes.STRING, allowNull: false },
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
