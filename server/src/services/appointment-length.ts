// Returns sum of lengths in minutes
export function calculateTotalLength(items: LengthItem[]): number {
    return items.reduce((sum, { quantity, length }) => sum + quantity * length, 0);
}

export interface LengthItem {
    quantity: number;
    length: number;
}
