import type { AnomalyLog, Transaction } from "../types";

// Nếu một giao dịch bất kỳ lớn hơn LARGE_TRANSACTION_THRESHOLD thì sẽ coi là bất thường
const LARGE_TRANSACTION_THRESHOLD = 100_000_000;

export function checkAnomaliesForTransaction(transaction: Transaction): AnomalyLog[] {
    const anomalies: AnomalyLog[] = [];

    // Gọi các hàm kiểm tra và thu thập kết quả
    // Nếu có bất thường thì sẽ trả về một mảng các AnomalyLog
    const largeTx = checkLargeTransaction(transaction);
    if (largeTx) anomalies.push(largeTx);

    const negativeBalance = checkNegativeBalance(transaction);
    if (negativeBalance) anomalies.push(negativeBalance);

    const mismatch = checkCalculationMismatch(transaction);
    if (mismatch) anomalies.push(mismatch);

    return anomalies;
}

// Trường hợp 1: Kiểm tra xem giao dịch có giá trị quá lớn không
function checkLargeTransaction(transaction: Transaction): AnomalyLog | null {
    if (transaction.Amount > LARGE_TRANSACTION_THRESHOLD) {
        return {
            transactionId: transaction.TransactionID,
            customerId: transaction.CustomerID,
            ruleViolated: 'Giao dịch giá trị lớn',
            details: `Số tiền giao dịch ${transaction.Amount.toLocaleString('vi-VN')} VND vượt ngưỡng cho phép là ${LARGE_TRANSACTION_THRESHOLD.toLocaleString('vi-VN')} VND.`,
            timestamp: new Date().toISOString(),
        };
    }
    return null; // Không có bất thường
}

// Trường hợp 2: Kiểm tra xem số dư cuối kỳ có bị âm không
function checkNegativeBalance(transaction: Transaction): AnomalyLog | null {
    if (transaction.BalanceAfter < 0) {
        return {
            transactionId: transaction.TransactionID,
            customerId: transaction.CustomerID,
            ruleViolated: 'Số dư âm',
            details: `Tài khoản bị âm sau giao dịch: ${transaction.BalanceAfter.toLocaleString('vi-VN')} VND.`,
            timestamp: new Date().toISOString(),
        };
    }
    return null;
}

// Trường hợp 3: Kiểm tra xem số dư có được tính toán đúng không
function checkCalculationMismatch(transaction: Transaction): AnomalyLog | null {
    const expectedBalance = transaction.TransactionType === 'IN'
        ? transaction.BalanceBefore + transaction.Amount
        : transaction.BalanceBefore - transaction.Amount;

    // Dùng sai số nhỏ (epsilon) để tránh lỗi so sánh số thực
    if (Math.abs(expectedBalance - transaction.BalanceAfter) > 0.01) {
        return {
            transactionId: transaction.TransactionID,
            customerId: transaction.CustomerID,
            ruleViolated: 'Sai lệch tính toán số dư',
            details: `Sai lệch số dư. Kỳ vọng: ${expectedBalance.toLocaleString('vi-VN')}, thực tế: ${transaction.BalanceAfter.toLocaleString('vi-VN')}.`,
            timestamp: new Date().toISOString(),
        };
    }
    return null; // Không có bất thường
}