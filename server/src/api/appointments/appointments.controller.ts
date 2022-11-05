import { Appointment, AppointmentFact, AppointmentQuestion, Factor, Service, User } from '../../models';
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
    try {
        const { id } = await Appointment.create({ userId: (request.user as User).id });

        const attributes = ['id', 'confirmed', 'estimatedPrice', 'startsAt'];
        const appointment = await Appointment.findByPk(id, { include: [Service, Factor], attributes });

        response.status(201).json(appointment);
    } catch (e) {
        response.status(500).json({ error: 'Operation failed!' });
    }
}

interface AddServiceToAppointmentRequest extends Request {
    params: { appointmentId: string };
    body: { serviceId: string };
}

export async function addServiceToAppointment(request: AddServiceToAppointmentRequest, response: Response) {
    try {
        const [appointment, service] = await Promise.all([
            Appointment.findByPk(request.params.appointmentId),
            Service.findByPk(request.body.serviceId),
        ]);

        if (appointment && service) {
            await appointment.addService(service, {});
            response.sendStatus(200);
        }
    } catch (e) {
        response.sendStatus(400);
    }
}

interface RemoveServiceFromAppointmentRequest extends Request {
    params: { appointmentId: string; serviceId: string };
}

export async function removeServiceFromAppointment(request: RemoveServiceFromAppointmentRequest, response: Response) {
    const [appointment, service] = await Promise.all([
        Appointment.findByPk(request.params.appointmentId),
        Service.findByPk(request.params.serviceId),
    ]);

    if (appointment && service) {
        await appointment.removeService(service);
        return response.sendStatus(200);
    }
    response.sendStatus(404);
}
