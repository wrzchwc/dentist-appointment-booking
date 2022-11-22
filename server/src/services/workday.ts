/*eslint no-unused-vars: 0*/
export enum WorkDayHour {
    Start = 9,
    End = 17,
}
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
