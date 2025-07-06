

// --- CẤU HÌNH CÁC NGƯỠNG ---

import type { AnomalyLog, Transaction } from "../types";

// Nếu mà cái giáo dịch bất kì lớn hơn LARGE_TRANSACTION_THRESHOLD thì sẽ coi là bất thường
const LARGE_TRANSACTION_THRESHOLD = 100_000_000;

export function checkAnomaliesForTransaction(transaction: Transaction): AnomalyLog[] {
    const anomalies: AnomalyLog[] = [];

    // Call các method để check và thu thập results
    // Nếu có bất thường thì sẽ trả về một array các AnomalyLog
    const largeTx = checkLargeTransaction(transaction);
    if (largeTx) anomalies.push(largeTx);

    const negativeBalance = checkNegativeBalance(transaction);
    if (negativeBalance) anomalies.push(negativeBalance);

    const mismatch = checkCalculationMismatch(transaction);
    if (mismatch) anomalies.push(mismatch);

    return anomalies;
}

// Case 1: Kiểm tra xem giao dịch có giá trị quá lớn không
function checkLargeTransaction(transaction: Transaction): AnomalyLog | null {
    if (transaction.Amount > LARGE_TRANSACTION_THRESHOLD) {
        return {
            transactionId: transaction.TransactionID,
            customerId: transaction.CustomerID,
            ruleViolated: 'Large Amount Transaction',
            details: `Transaction amount ${transaction.Amount.toLocaleString('vi-VN')} VND exceeds the threshold of ${LARGE_TRANSACTION_THRESHOLD.toLocaleString('vi-VN')} VND.`,
            timestamp: new Date().toISOString(),
        };
    }
    return null; // Không có bất thường
}

// Case 2: Kiểm tra xem số dư cuối kỳ có bị âm không
function checkNegativeBalance(transaction: Transaction): AnomalyLog | null {
    if (transaction.BalanceAfter < 0) {
        return {
            transactionId: transaction.TransactionID,
            customerId: transaction.CustomerID,
            ruleViolated: 'Negative Balance',
            details: `Account balance is negative after transaction: ${transaction.BalanceAfter.toLocaleString('vi-VN')} VND.`,
            timestamp: new Date().toISOString(),
        };
    }
    return null;
}

// case 3: Kiểm tra xem số dư có được tính toán đúng không
function checkCalculationMismatch(transaction: Transaction): AnomalyLog | null {
    const expectedBalance = transaction.TransactionType === 'IN'
        ? transaction.BalanceBefore + transaction.Amount
        : transaction.BalanceBefore - transaction.Amount;

    // Dùng sai số nhỏ (epsilon) để tránh lỗi so sánh số thực
    if (Math.abs(expectedBalance - transaction.BalanceAfter) > 0.01) {
        return {
            transactionId: transaction.TransactionID,
            customerId: transaction.CustomerID,
            ruleViolated: 'Calculation Mismatch',
            details: `Balance calculation mismatch. Expected: ${expectedBalance.toLocaleString('vi-VN')}, but got: ${transaction.BalanceAfter.toLocaleString('vi-VN')}.`,
            timestamp: new Date().toISOString(),
        };
    }
    return null;
}