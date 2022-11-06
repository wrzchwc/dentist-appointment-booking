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
        const appointment = await Appointment.findByPk(request.params.appointmentId, { include: Service });
        if (!appointment) {
            return response.status(404).send({ error: 'Appointment not found' });
        }

        const service = appointment.services.find(({ id }) => id === request.body.serviceId);
        if (!service) {
            await appointment.addService(request.body.serviceId);
        } else {
            await service.appointment.increment({ quantity: 1 });
        }
    } catch (e) {
        return response.status(500).send({ error: 'Operation failed' });
    }

    response.sendStatus(200);
}

interface RemoveServiceFromAppointmentRequest extends Request {
    params: { appointmentId: string; serviceId: string };
}

export async function removeServiceFromAppointment(request: RemoveServiceFromAppointmentRequest, response: Response) {
    try {
        const appointment = await Appointment.findByPk(request.params.appointmentId, { include: Service });
        if (!appointment) {
            return response.status(404).send('Appointment not found');
        }

        const service = appointment.services.find(({ id }) => id === request.params.serviceId);
        if (!service) {
            return response.status(400).send('Service not associated with appointment');
        } else if (service.appointment.quantity === 1) {
            await appointment.removeService(request.params.serviceId);
        } else {
            await service.appointment.decrement({ quantity: 1 });
        }
    } catch (e) {
        return response.status(500).send('Operation failed');
    }
    return response.sendStatus(200);
}
