import * as m from '../../models';
import * as r from './appointments.requests';
import { LengthItem, Period, calculateTotalLength, createPeriod, isOverlappingPeriod } from '../../services';
import { Request, Response } from 'express';
import { WorkDayHour, isWorkingTime } from '../../services/workday';
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
        appointment = await getApppointmentWithAssociations(createdAppointment.id);
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

async function getApppointmentWithAssociations(id: string) {
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
            attributes: ['id', 'startsAt'],
            order: [['startsAt', 'ASC']],
            include: [
                { model: m.Service, attributes: ['id', 'name'], through: { attributes: [] } },
                { model: m.User, attributes: ['id', 'name', 'surname'] },
            ],
            where: { startsAt: createStartsAtCondition(query) },
        });
    } catch (e) {
        return response.status(500).json({ error: 'Operation failed' });
    }

    response.status(200).json(appointments);
}

export async function getClientAppointments({ session, query }: r.GetAppointments, response: Response) {
    let appointments: m.Appointment[];

    try {
        const user = await m.User.find(session?.passport.user.id);
        appointments = await user.getAppointments({
            attributes: ['id', 'startsAt'],
            order: [['startsAt', 'ASC']],
            include: [{ model: m.Service, through: { attributes: ['quantity'] } }],
            where: { startsAt: createStartsAtCondition(query) },
        });
    } catch (e) {
        const [code, error] = getErrorData(e);
        return response.status(code).json({ error });
    }

    response.status(200).json(appointments);
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

export async function deleteClientAppointment({ params, session }: r.DeleteAppointment, response: Response) {
    try {
        await m.Appointment.destroy({ where: { id: params.appointmentId, userId: session?.passport.user.id } });
    } catch (e) {
        return response.sendStatus(500);
    }

    response.sendStatus(200);
}

export async function deleteAppointment({ params }: r.DeleteAppointment, response: Response) {
    try {
        await m.Appointment.destroy({ where: { id: params.appointmentId } });
    } catch (e) {
        return response.sendStatus(500);
    }

    response.sendStatus(200);
}

function getErrorData(e: unknown | m.ModelError): [number, string] {
    return e instanceof m.ModelError ? [e.httpCode, e.message] : [500, 'Operation failed'];
}

export async function getAvailableDates({ query }: r.GetAvailableDates, response: Response) {
    let appointments: m.Appointment[];

    try {
        appointments = await findAllAppointments(query);
    } catch (e) {
        return response.status(500).json({ error: 'Operation failed' });
    }

    response.status(200).json(calculateAvailableDates(query, appointments.map(mapAppointmentToPeriod)));
}

async function findAllAppointments(query: r.GetAvailableDatesQuery) {
    return m.Appointment.findAll({
        attributes: ['startsAt'],
        order: [['startsAt', 'ASC']],
        include: [{ model: m.Service, attributes: ['length'], through: { attributes: ['quantity'] } }],
        where: {
            startsAt: {
                [Op.between]: [query.date, new Date(new Date(query.date).setHours(WorkDayHour.End, 0, 0, 0))],
            },
        },
    });
}

function mapAppointmentToPeriod({ startsAt, services }: m.Appointment): Period {
    return createPeriod(new Date(startsAt), calculateTotalLength(services.map(mapServiceToLengthItem)));
}

function mapServiceToLengthItem(service: m.Service): LengthItem {
    return { length: service.length!, quantity: service.appointmentServices.quantity };
}

function calculateAvailableDates(query: r.GetAvailableDatesQuery, bookedPeriods: Period[]): Date[] {
    const availableTimes: Date[] = [];
    const date = new Date(new Date(query.date).setHours(WorkDayHour.Start, 0, 0, 0));

    while (isWorkingTime(date, query.length)) {
        const period = createPeriod(date, query.length);
        if (!isOverlappingPeriod(period, bookedPeriods)) {
            availableTimes.push(new Date(date));
        }
        date.setMinutes(date.getMinutes() + 15);
    }

    return availableTimes;
}

export async function getClientAppointment({ params, session }: r.GetAppointment, response: Response) {
    let appointment: m.Appointment | null;

    try {
        appointment = await m.Appointment.findOne({
            where: { userId: session?.passport.user.id, id: params.appointmentId },
            attributes: ['id', 'startsAt'],
            include: [{ model: m.Service, through: { attributes: ['quantity'] } }],
        });
    } catch (e) {
        return response.status(500).json({ error: 'Operation failed' });
    }

    if (appointment === null) {
        response.status(404).json({ error: 'Appointment not found' });
    } else {
        response.status(200).json(appointment);
    }
}

const getAppointmentIncludeOptions = [
    {
        model: m.Service,
        attributes: ['id', 'name', 'price', 'length', 'detail'],
        through: { attributes: ['quantity'] },
    },
    { model: m.AppointmentFact, attributes: ['id', 'value'], through: { attributes: ['additionalInfo'] } },
    { model: m.User, attributes: ['name', 'surname', 'email', 'id', 'photoUrl'] },
];

export async function getAppointment({ params }: r.GetAppointment, response: Response) {
    let appointment: m.Appointment | null;

    try {
        appointment = await m.Appointment.findByPk(params.appointmentId, {
            attributes: ['id', 'startsAt'],
            include: getAppointmentIncludeOptions,
        });
    } catch (e) {
        return response.status(500).json({ error: 'Operation failed' });
    }

    if (appointment === null) {
        return response.status(404).json({ error: 'Appointment not found' });
    }
    response.status(200).json(appointment);
}
