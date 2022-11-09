import * as requests from './appointments.requests';
import {
    Appointment,
    AppointmentFact,
    AppointmentQuestion,
    AppointmentsServices,
    Factor,
    ModelError,
    Service,
    User,
} from '../../models';
import { Request, Response } from 'express';

export async function getQuestions(request: Request, response: Response) {
    const questions = await AppointmentQuestion.findAll({
        include: {
            model: AppointmentFact,
            attributes: ['id', 'value'],
        },
    });
    response.status(200).json(questions);
}

export async function getServices(request: Request, response: Response) {
    const services = await Service.findAll();
    response.status(200).json(services);
}

export async function createAppointment(request: Request, response: Response) {
    let appointment: Appointment | null = null;

    try {
        const { id } = await Appointment.create({ userId: (request.user as User).id });

        appointment = await Appointment.findByPk(id, {
            include: [Service, Factor],
            attributes: ['id', 'confirmed', 'estimatedPrice', 'startsAt'],
        });
    } catch (e) {
        response.status(500).json({ error: 'Operation failed!' });
    }

    response.status(201).json(appointment);
}

export async function addServiceToAppointment(request: requests.AddServiceToAppointment, response: Response) {
    const { appointmentId } = request.params;
    const { serviceId } = request.body;

    try {
        const [[appointment, service], areAssociated] = await Promise.all([
            findAppointmentAndService(appointmentId, serviceId),
            AppointmentsServices.findOne({ where: { appointmentId, serviceId } }),
        ]);

        await (areAssociated ? increaseServiceQuantity(appointment, service) : appointment.addService(serviceId));
    } catch (e) {
        const [code, error] = getErrorData(e);
        return response.status(code).json({ error });
    }

    response.sendStatus(200);
}

async function increaseServiceQuantity(appointment: Appointment, service: Service) {
    return updateServiceQuantity(true, appointment.id, service.id);
}

export async function removeServiceFromAppointment(request: requests.RemoveServiceFromAppointment, response: Response) {
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

async function findAppointmentServiceAssociation(appointmentId: string, serviceId: string) {
    const association = await AppointmentsServices.findOne({ where: { appointmentId, serviceId } });

    if (!association) {
        throw new ModelError('Appointment and service not associated', 400);
    }

    return association;
}

async function decreaseServiceQuantity(appointment: Appointment, service: Service) {
    return updateServiceQuantity(false, appointment.id, service.id);
}

async function updateServiceQuantity(increment: boolean, appointmentId: string, serviceId: string) {
    const where = { appointmentId, serviceId };
    await AppointmentsServices.increment({ quantity: increment ? 1 : -1 }, { where });
}

async function findAppointmentAndService(appointmentId: string, serviceId: string): Promise<[Appointment, Service]> {
    return await Promise.all([Appointment.find(appointmentId), Service.find(serviceId)]);
}

function getErrorData(e: unknown | ModelError): [number, string] {
    return e instanceof ModelError ? [e.httpCode, e.message] : [500, 'Operation failed'];
}
