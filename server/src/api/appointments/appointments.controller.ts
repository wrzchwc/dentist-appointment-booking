import * as m from '../../models';
import * as r from './appointments.requests';
import { Request, Response } from 'express';
import { Appointment } from '../../models';
import { GetAppointmentsQuery } from './appointments.requests';
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

export async function createAppointment(request: Request, response: Response) {
    let appointment: m.Appointment | null = null;

    try {
        const { id } = await m.Appointment.create({ userId: (request.user as m.User).id });
        appointment = await m.Appointment.findByPk(id, {
            include: [m.Service, m.AppointmentFact],
            attributes: ['id', 'confirmed', 'startsAt'],
        });
    } catch (e) {
        return response.status(500).json({ error: 'Operation failed!' });
    }

    response.status(201).json(appointment);
}

export async function addServiceToAppointment(request: r.AddServiceToAppointment, response: Response) {
    const { appointmentId } = request.params;
    const { serviceId } = request.body;

    try {
        const [[appointment, service], areAssociated] = await Promise.all([
            findAppointmentAndService(appointmentId, serviceId),
            m.AppointmentsServices.findOne({ where: { appointmentId, serviceId } }),
        ]);

        await (areAssociated ? increaseServiceQuantity(appointment, service) : appointment.addService(serviceId));
    } catch (e) {
        const [code, error] = getErrorData(e);
        return response.status(code).json({ error });
    }

    response.sendStatus(200);
}

export async function removeServiceFromAppointment(request: r.RemoveServiceFromAppointment, response: Response) {
    const { appointmentId, serviceId } = request.params;

    try {
        const [[appointment, service], { quantity }] = await Promise.all([
            findAppointmentAndService(appointmentId, serviceId),
            findAppointmentServiceAssociation(appointmentId, serviceId),
        ]);

        await (quantity === 1 ? appointment.removeService(serviceId) : decreaseServiceQuantity(appointment, service));
    } catch (e) {
        const [code, error] = getErrorData(e);
        return response.status(code).json({ error });
    }

    response.sendStatus(200);
}

export async function addFactToAppointment({ params, body }: r.AddFactToAppointment, response: Response) {
    try {
        const [appointment, fact] = await findAppointmentAndFact(params.appointmentId, body.factId);
        await appointment.addFact(fact.id, { through: { additionalInfo: body.additionalInfo } });
    } catch (e) {
        const [code, error] = getErrorData(e);
        return response.status(code).json({ error });
    }

    response.sendStatus(200);
}

export async function removeFactFromAppointment({ params }: r.RemoveAppointmentFactor, response: Response) {
    try {
        const [[appointment, fact]] = await Promise.all([
            findAppointmentAndFact(params.appointmentId, params.factId),
            m.HealthSurvey.find(params.appointmentId, params.factId),
        ]);

        await appointment.removeFact(fact.id);
    } catch (e) {
        const [code, message] = getErrorData(e);
        return response.status(code).json({ error: message });
    }

    response.sendStatus(200);
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

export async function updateAppointmentConfirmedStatus(
    request: r.UpdateAppointmentConfirmedStatus,
    response: Response
) {
    let updatedAppointments: Appointment[];

    try {
        [, updatedAppointments] = await Appointment.update(
            { confirmed: request.body.confirmed },
            { where: { id: request.params.appointmentId }, returning: true }
        );
    } catch (e) {
        const [code, message] = getErrorData(e);
        return response.status(code).json({ error: message });
    }

    if (updatedAppointments.length !== 1) {
        return response.status(404).json({ error: 'Appointment not found' });
    }

    return response.status(200).json(updatedAppointments[0]);
}

export async function getAppointments({ query }: r.GetAppointments, response: Response) {
    let appointments: Appointment[];

    try {
        appointments = await Appointment.findAll({
            where: { confirmed: true, startsAt: getStartsAtCondition(query) },
            include: [m.Service],
            order: [['startsAt', 'ASC']],
            attributes: ['id', 'startsAt'],
        });
    } catch (e) {
        return response.status(500).json({ error: 'Operation failed' });
    }

    response.status(200).json(appointments);
}

function getStartsAtCondition({ before, after }: GetAppointmentsQuery) {
    if (after && before) {
        return { [Op.between]: [after, before] };
    } else if (after) {
        return { [Op.gt]: after };
    } else if (before) {
        return { [Op.lt]: before };
    }
    return { [Op.ne]: null };
}

async function increaseServiceQuantity(appointment: m.Appointment, service: m.Service) {
    return updateServiceQuantity(true, appointment.id, service.id);
}

async function findAppointmentServiceAssociation(appointmentId: string, serviceId: string) {
    const association = await m.AppointmentsServices.findOne({ where: { appointmentId, serviceId } });

    if (!association) {
        throw new m.ModelError('Appointment and service not associated', 400);
    }

    return association;
}

async function decreaseServiceQuantity(appointment: m.Appointment, service: m.Service) {
    return updateServiceQuantity(false, appointment.id, service.id);
}

async function updateServiceQuantity(increment: boolean, appointmentId: string, serviceId: string) {
    const where = { appointmentId, serviceId };
    await m.AppointmentsServices.increment({ quantity: increment ? 1 : -1 }, { where });
}

async function findAppointmentAndService(
    appointmentId: string,
    serviceId: string
): Promise<[m.Appointment, m.Service]> {
    return await Promise.all([m.Appointment.find(appointmentId), m.Service.find(serviceId)]);
}

async function findAppointmentAndFact(
    appointmentId: string,
    factId: string
): Promise<[m.Appointment, m.AppointmentFact]> {
    return Promise.all([m.Appointment.find(appointmentId), m.AppointmentFact.find(factId)]);
}

function getErrorData(e: unknown | m.ModelError): [number, string] {
    return e instanceof m.ModelError ? [e.httpCode, e.message] : [500, 'Operation failed'];
}
