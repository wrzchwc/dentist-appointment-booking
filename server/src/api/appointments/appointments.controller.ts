import * as m from '../../models';
import * as r from './appointments.requests';
import { Request, Response } from 'express';

export async function getQuestions(request: Request, response: Response) {
    const questions = await m.AppointmentQuestion.findAll({
        include: {
            model: m.AppointmentFact,
            attributes: ['id', 'value'],
        },
    });
    response.status(200).json(questions);
}

export async function getServices(request: Request, response: Response) {
    const services = await m.Service.findAll();
    response.status(200).json(services);
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
