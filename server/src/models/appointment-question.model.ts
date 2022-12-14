import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize';
import { AppointmentFact } from './appointment-fact.model';
import { sequelizeInstance } from '../services';

export class AppointmentQuestion extends Model<
    InferAttributes<AppointmentQuestion>,
    InferCreationAttributes<AppointmentQuestion>
> {
    declare id: CreationOptional<string>;
    declare question: string;
    declare subquestion: string | null;
    declare womenOnly: boolean;

    declare fact?: NonAttribute<AppointmentFact>;
}

AppointmentQuestion.init(
    {
        id: { type: DataTypes.UUID, primaryKey: true, allowNull: false, defaultValue: DataTypes.UUIDV4 },
        question: { type: DataTypes.STRING, unique: true, allowNull: false },
        subquestion: { type: DataTypes.STRING },
        womenOnly: { type: DataTypes.BOOLEAN, allowNull: false },
    },
    { timestamps: false, sequelize: sequelizeInstance, tableName: 'appointment_questions' }
);

AppointmentQuestion.hasOne(AppointmentFact, { foreignKey: { name: 'questionId' } });
AppointmentFact.belongsTo(AppointmentQuestion, { foreignKey: { name: 'questionId' } });
