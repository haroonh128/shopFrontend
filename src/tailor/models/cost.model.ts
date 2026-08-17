export interface costFormValues {
    id?: string;
    clientId: string;
    measurementId?: string;
    totalCost: number;
    advance: number;
    pending?: number;
    notes: string;
}

export const pendingAmount = (totalCost: number, advance: number) => {
    const pending = Number(totalCost || 0) - Number(advance || 0);
    return Number.isFinite(pending) ? pending : 0;
};

export const formatMoney = (value?: number) => {
    const amount = Number(value ?? 0);
    return Number.isFinite(amount) ? amount.toFixed(2) : "0.00";
};
