import * as m from '../../models';
import * as r from './appointments.requests';
import { Appointment, AppointmentFact, Service, User } from '../../models';
import { Request, Response } from 'express';
import { Op } from 'sequelize';

export async function getQuestions(request: Request, response: Response) {
    const questions = await m.AppointmentQuestion.findAll({
        include: {
            model: m.AppointmentFact,
            attributes: ['value'],
        },
    });
    response.status(200).json(questions);
}

export async function createAppointment(request: r.CreateAppointment, response: Response) {
    const user = await User.findByPk((request.user as User).id);
    if (!user) {
        return response.sendStatus(404);
    }

    const createdAppointment = await user.createAppointment({ startsAt: request.body.startsAt });

    for (const { id, quantity } of request.body.services) {
        await createdAppointment.addService(id, { through: { quantity } });
    }

    if (request.body.facts) {
        for (const { id, additionalInfo } of request.body.facts) {
            await createdAppointment.addFact(id, { through: { additionalInfo } });
        }
    }

    const appointment = await Appointment.findByPk(createdAppointment.id, {
        attributes: ['id', 'startsAt'],
        include: [
            {
                model: Service,
                attributes: ['name', 'price', 'count', 'detail', 'length'],
                through: { attributes: ['quantity'] },
            },
            {
                model: AppointmentFact,
                attributes: ['value'],
                through: { attributes: ['additionalInfo'] },
            },
        ],
    });

    response.status(201).json(appointment);
}

async function addServicesToAppointment(
    appointment: Appointment,
    attributes: r.ServiceAssociationCreationAttributes[]
) {
    return attributes.map(({ id, quantity }) => appointment.addService(id, { through: { quantity } }));
}

async function addFactsToAppointment(appointment: Appointment, attributes?: r.FactAssociationCreationAttributes[]) {
    if (attributes) {
        return attributes.map(({ id, additionalInfo }) => appointment.addFact(id, { through: { additionalInfo } }));
    }
    return Promise.resolve();
}

export async function updateAppointmentStartDate(request: r.UpdateAppointmentStartDate, response: Response) {
    let updatedAppointments: Appointment[];

    try {
        [, updatedAppointments] = await Appointment.update(
            { startsAt: request.body.startsAt },
            { where: { id: request.params.appointmentId }, returning: true }
        );
    } catch (e) {
        const [code, message] = getErrorData(e);
        return response.status(code).json({ error: message });
    }

    if (updatedAppointments.length !== 1) {
        return response.status(404).json({ error: 'Appointment not found' });
    }

    response.status(200).json(updatedAppointments[0]);
}

export async function getAppointments({ query }: r.GetAppointments, response: Response) {
    let appointments: Appointment[];

    try {
        appointments = await Appointment.findAll({
            where: { startsAt: getStartsAtCondition(query) },
            include: [{ model: m.Service, through: { attributes: ['quantity'] } }],
            order: [['startsAt', 'ASC']],
            attributes: ['id', 'startsAt'],
        });
    } catch (e) {
        return response.status(500).json({ error: 'Operation failed' });
    }

    response.status(200).json(appointments);
}

function getStartsAtCondition({ before, after }: r.GetAppointmentsQuery) {
    if (after && before) {
        return { [Op.between]: [after, before] };
    } else if (after) {
        return { [Op.gt]: after };
    } else if (before) {
        return { [Op.lt]: before };
    }
    return { [Op.ne]: null };
}

function getErrorData(e: unknown | m.ModelError): [number, string] {
    return e instanceof m.ModelError ? [e.httpCode, e.message] : [500, 'Operation failed'];
}
