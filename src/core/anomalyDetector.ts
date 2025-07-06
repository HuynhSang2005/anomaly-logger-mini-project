

// --- CẤU HÌNH CÁC NGƯỠNG ---

import type { AnomalyLog, Transaction } from "../types";

// Nếu mà cái giáo dịch bất kì lớn hơn LARGE_TRANSACTION_THRESHOLD thì sẽ coi là bất thường
const LARGE_TRANSACTION_THRESHOLD = 100_000_000;

export function checkAnomaliesForTransaction(transaction: Transaction): AnomalyLog[] {
    const anomalies: AnomalyLog[] = [];

    return anomalies;
}