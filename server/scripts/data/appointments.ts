import { AppointmentQuestion } from '../../src/models';
import { join } from 'path';
import { readFileSync } from 'fs';

interface AppointmentFactor {
    question: string;
    subquestion?: string;
    womenOnly: boolean;
    fact: string;
}

async function loadAppointmentFactorData() {
    const path = join(__dirname, '..', '..', '..', 'data', 'appointments.json');
    const factors: AppointmentFactor[] = JSON.parse(readFileSync(path, 'utf8'));
    for (const factor of factors) {
        const question = await AppointmentQuestion.create({
            question: factor.question,
            subquestion: factor.subquestion,
            womenOnly: factor.womenOnly,
        });
        await question.createAppointmentFact({ value: factor.fact });
    }
}

// eslint-disable-next-line no-console
loadAppointmentFactorData().catch(console.error);
