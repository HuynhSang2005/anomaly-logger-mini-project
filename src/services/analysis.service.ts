// src/services/analysisService.ts
import logger from '../utils/logger';
import { readTransactionsFromFile } from '../core/dataReader';
import { checkAnomaliesForTransaction } from '../core/anomalyDetector';
import { generateTxtReport } from '../core/reportGenerator';
import type { AnomalyLog } from '../types';

export function runAnalysis(filePath: string): AnomalyLog[] {
    logger.info(`Bắt đầu phân tích file: ${filePath}`);

    try {
        const transactions = readTransactionsFromFile(filePath);
        logger.info(`Đọc thành công ${transactions.length} giao dịch.`);

        const allAnomalies: AnomalyLog[] = [];

        for (const transaction of transactions) {
            const anomalies = checkAnomaliesForTransaction(transaction);
            if (anomalies.length > 0) {
                allAnomalies.push(...anomalies);
                anomalies.forEach(anomaly => {
                    logger.warn({ anomaly }, 'Phát hiện bất thường!');
                });
            }
        }

        if (allAnomalies.length > 0) {
            logger.info(`Phân tích hoàn tất. Phát hiện ${allAnomalies.length} bất thường.`);
            // GỌI HÀM TẠO BÁO CÁO Ở ĐÂY
            generateTxtReport(allAnomalies, 'reports');
        } else {
            logger.info('Phân tích hoàn tất. Không phát hiện bất thường nào.');
        }

        return allAnomalies;

    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Phân tích thất bại: ${error.message}`);
        } else {
            logger.error('Phân tích thất bại do lỗi không xác định.');
        }
        return [];
    }
}