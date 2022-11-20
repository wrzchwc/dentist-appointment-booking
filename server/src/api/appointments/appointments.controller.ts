import * as m from '../../models';
import * as r from './appointments.requests';
import { Request, Response } from 'express';
import { Op } from 'sequelize';

export async function getQuestions(request: Request, response: Response) {
    const questions = await m.AppointmentQuestion.findAll({
        include: {
            model: m.AppointmentFact,
            attributes: ['id', 'value'],
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
    if (facts) {
        return Promise.all([
            ...services.map((service) => mapToAddServicePromise(appointment, service)),
            ...facts.map((fact) => mapToAddFactPromise(appointment, fact)),
        ]);
    }
    return Promise.all([...services.map((service) => mapToAddServicePromise(appointment, service))]);
}

async function mapToAddServicePromise(appointment: m.Appointment, attribute: r.ServiceAssociationCreationAttribute) {
    return appointment.addService(attribute.id, { through: { quantity: attribute.quantity } });
}

async function mapToAddFactPromise(appointment: m.Appointment, attribute: r.FactAssociationCreationAttribute) {
    return appointment.addFact(attribute.id, { through: { additionalInfo: attribute.additionalInfo } });
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

export async function getAppointments(request: r.GetAppointments, response: Response) {
    let appointments: m.Appointment[];

    try {
        appointments = await m.Appointment.findAll(createGetAppointmentsOptions(request));
    } catch (e) {
        return response.status(500).json({ error: 'Operation failed' });
    }

    response.status(200).json(appointments);
}

export async function getClientAppointments(request: r.GetAppointments, response: Response) {
    let appointments: m.Appointment[];

    try {
        const user = await m.User.find(request.session?.passport.user.id);
        appointments = await user.getAppointments(createGetAppointmentsOptions(request));
    } catch (e) {
        const [code, error] = getErrorData(e);
        return response.status(code).json({ error });
    }

    response.status(200).json(appointments);
}

function createGetAppointmentsOptions({ query }: r.GetAppointments): any {
    return {
        attributes: ['id', 'startsAt'],
        order: [['startsAt', 'ASC']],
        include: [{ model: m.Service, through: { attributes: ['quantity'] } }],
        where: { startsAt: createStartsAtCondition(query) },
    };
}

function createStartsAtCondition({ before, after }: r.DateRange) {
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
