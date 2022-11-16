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
            where: { confirmed: true, startsAt: getStartsAtCondition(query) },
            include: [{ model: m.Service, through: { attributes: ['quantity'] } }],
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

function getErrorData(e: unknown | m.ModelError): [number, string] {
    return e instanceof m.ModelError ? [e.httpCode, e.message] : [500, 'Operation failed'];
}
