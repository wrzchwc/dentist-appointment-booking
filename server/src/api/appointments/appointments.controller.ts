import {
    Appointment,
    AppointmentFact,
    AppointmentQuestion,
    AppointmentsServices,
    Factor,
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
    const { appointmentId } = request.params;
    const { serviceId } = request.body;

    try {
        const [appointment, service] = await findAppointmentAndService(appointmentId, serviceId);
        if (!appointment) {
            return response.status(404).json({ error: 'Appointment not found' });
        } else if (!service) {
            return response.status(404).json({ error: 'Service not found' });
        }

        if (!(await appointment.hasService(serviceId))) {
            await appointment.addService(serviceId);
        } else {
            await increaseServiceQuantity(appointment, service as Service);
        }
    } catch (e) {
        return response.status(500).json({ error: 'Operation failed' });
    }

    response.sendStatus(200);
}

async function increaseServiceQuantity(appointment: Appointment, service: Service) {
    return updateServiceQuantity(true, appointment.id, service.id);
}

interface RemoveServiceFromAppointmentRequest extends Request {
    params: { appointmentId: string; serviceId: string };
}

export async function removeServiceFromAppointment(request: RemoveServiceFromAppointmentRequest, response: Response) {
    try {
        const [appointment] = await findAppointmentAndService(request.params.appointmentId, request.params.serviceId);
        if (!appointment) {
            return response.status(404).send({ error: 'Appointment not found' });
        }

        const service = appointment.services.find(({ id }) => id === request.params.serviceId);
        if (!service) {
            return response.status(400).json({ error: 'Service not associated with appointment' });
        } else if (service.appointment.quantity === 1) {
            await appointment.removeService(request.params.serviceId);
        } else {
            await decreaseServiceQuantity(appointment, service);
        }
    } catch (e) {
        return response.status(500).json({ error: 'Operation failed' });
    }

    return response.sendStatus(200);
}

async function findAppointmentAndService(appointmentId: string, serviceId: string) {
    return Promise.all([Appointment.findByPk(appointmentId, { include: Service }), Service.findByPk(serviceId)]);
}

async function decreaseServiceQuantity(appointment: Appointment, service: Service) {
    return updateServiceQuantity(false, appointment.id, service.id);
}

async function updateServiceQuantity(increment: boolean, appointmentId: string, serviceId: string) {
    const where = { appointmentId, serviceId };
    await AppointmentsServices.increment({ quantity: increment ? 1 : -1 }, { where });
}
