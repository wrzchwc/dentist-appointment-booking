import { AppointmentQuestion, Service } from '../../models';
import { Request, Response } from 'express';

export async function getQuestions(request: Request, response: Response) {
    const questions = await AppointmentQuestion.findAll({});
    response.status(200).json(questions);
}

export async function getServices(request: Request, response: Response) {
    const services = await Service.findAll();
    response.status(200).json(services);
}
