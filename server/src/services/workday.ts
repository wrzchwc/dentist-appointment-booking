/*eslint no-unused-vars: 0*/
export function getCurrentWorkday(): Date {
    const date = new Date();

    if (date.getDay() === WeekDay.Saturday) {
        date.setDate(date.getDate() + 2);
        return new Date(date.setHours(WorkDayHour.Start, 0, 0, 0));
    } else if (date.getDay() === WeekDay.Sunday || date.getHours() > WorkDayHour.End) {
        return calculateNextWorkday(date);
    } else if (date.getHours() < WorkDayHour.Start) {
        date.setHours(WorkDayHour.Start, 0, 0, 0);
        return date;
    }
    return date;
}

enum WeekDay {
    Friday = 5,
    Saturday = 6,
    Sunday = 0,
}

export enum WorkDayHour {
    Start = 9,
    End = 17,
}

function calculateNextWorkday(date: Date): Date {
    const nextWeekday = new Date(new Date(date).setDate(date.getDate() + daysToNextWorkday(date)));
    return new Date(nextWeekday.setHours(WorkDayHour.Start, 0, 0, 0));
}

function daysToNextWorkday(date: Date): DaysToWorkday {
    return date.getDay() === WeekDay.Friday ? 3 : 1;
}

type DaysToWorkday = 3 | 1;

export function isWorkingTime(date: Date, plannedAppointmentLength = 0) {
    return (
        date.getHours() >= WorkDayHour.Start &&
        convertToMinutesSinceMidnight(date) <= WorkDayHour.End * 60 - plannedAppointmentLength
    );
}

// returns minutes since midnight on given day, eg. 1:23 AM -> 83
function convertToMinutesSinceMidnight(date: Date): number {
    return 60 * date.getHours() + date.getMinutes();
}
