export function createPeriod(startsAt: Date, length: number): Period {
    return { startsAt: new Date(startsAt), endsAt: new Date(startsAt.getTime() + length * 60 * 1000) };
}

export interface Period {
    startsAt: Date;
    endsAt: Date;
}

export function isOverlappingPeriod(period: Period, periods: Period[]): boolean {
    return (
        periodStartOverlaps(period, periods) ||
        periodEndOverlaps(period, periods) ||
        periodDurationOverlaps(period, periods)
    );
}

function periodStartOverlaps({ startsAt }: Period, periods: Period[]): boolean {
    return periods.some((period) => period.startsAt <= startsAt && startsAt < period.endsAt);
}

function periodEndOverlaps({ endsAt }: Period, periods: Period[]): boolean {
    return periods.some((period) => period.startsAt < endsAt && endsAt <= period.endsAt);
}

function periodDurationOverlaps({ startsAt, endsAt }: Period, periods: Period[]): boolean {
    return periods.some((period) => startsAt < period.startsAt && endsAt > period.endsAt);
}
