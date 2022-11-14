import * as s from 'sequelize';
import { Appointment } from './appointment.model';
import { AppointmentFact } from './appointment-fact.model';
import { ModelError } from './model-error';
import { sequelizeInstance } from '../services';

export class HealthSurvey extends s.Model<s.InferAttributes<HealthSurvey>, s.InferCreationAttributes<HealthSurvey>> {
    declare additionalInfo: string | null;
    declare appointmentId: s.ForeignKey<Appointment['id']>;
    declare factId: s.ForeignKey<AppointmentFact['id']>;

    static async find(appointmentId: string, factId: string) {
        const survey = await HealthSurvey.findOne({ where: { appointmentId, factId } });

        if (!survey) {
            throw new ModelError('Appointment and fact not associated', 400);
        }

        return survey;
    }
}

HealthSurvey.init(
    { additionalInfo: s.DataTypes.STRING },
    { sequelize: sequelizeInstance, tableName: 'health_survey', timestamps: false, modelName: 'healthSurvey' }
);
