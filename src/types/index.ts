export interface Transaction {
    TransactionID: string;
    CustomerID: string;
    Timestamp: string;
    TransactionType: 'IN' | 'OUT';
    Amount: number;
    BalanceBefore: number;
    BalanceAfter: number;
}

export interface AnomalyLog {
    transactionId: string;
    customerId: string;
    ruleViolated: string; // Tên của quy tắc bị vi phạm
    details: string;      // Mô tả chi tiết về bất thường
    timestamp: string;    // Thời gian phát hiện
}