import { Request, Response } from 'express';
import { AppointmentQuestion } from '../../models';

export async function getQuestions(request: Request, response: Response) {
    const questions = await AppointmentQuestion.findAll({});
    response.status(200).json(questions);
}
