import * as m from '../../models';
import * as r from './appointments.requests';
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
    let appointment: m.Appointment | null;

    try {
        const user = await m.User.find((request.user as m.User).id);
        const createdAppointment = await user.createAppointment({ startsAt: request.body.startsAt });
        await addResourcesToAppointment(createdAppointment, request.body);
        appointment = await getAppointment(createdAppointment.id);
    } catch (e) {
        const [code, error] = getErrorData(e);
        return response.status(code).json({ error });
    }

    response.status(201).json(appointment);
}

async function addResourcesToAppointment(appointment: m.Appointment, { services, facts }: r.CreateAppointmentBody) {
    return Promise.all([addServicesToAppointment(appointment, services), addFactsToAppointment(appointment, facts)]);
}

async function addServicesToAppointment(
    appointment: m.Appointment,
    attributes: r.ServiceAssociationCreationAttribute[]
) {
    return attributes.map(({ id, quantity }) => appointment.addService(id, { through: { quantity } }));
}

async function addFactsToAppointment(appointment: m.Appointment, attributes?: r.FactAssociationCreationAttribute[]) {
    if (attributes) {
        return attributes.map(({ id, additionalInfo }) => appointment.addFact(id, { through: { additionalInfo } }));
    }
    return Promise.resolve();
}

async function getAppointment(id: string) {
    const serviceAttributes = ['name', 'price', 'count', 'detail', 'length'];
    const services = { model: m.Service, attributes: serviceAttributes, through: { attributes: ['quantity'] } };
    const facts = { model: m.AppointmentFact, attributes: ['value'], through: { attributes: ['additionalInfo'] } };

    return m.Appointment.findByPk(id, { attributes: ['id', 'startsAt'], include: [services, facts] });
}

export async function updateAppointmentStartDate(request: r.UpdateAppointmentStartDate, response: Response) {
    let updatedAppointments: m.Appointment[];

    try {
        [, updatedAppointments] = await m.Appointment.update(
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
    let appointments: m.Appointment[];

    try {
        appointments = await m.Appointment.findAll({
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
