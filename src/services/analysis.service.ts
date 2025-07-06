// src/services/analysisService.ts
import logger from '../utils/logger';
import { readTransactionsFromFile } from '../core/dataReader';
import { checkAnomaliesForTransaction } from '../core/anomalyDetector';
import { generateTxtReport } from '../core/reportGenerator';
import type { AnomalyLog } from '../types';

export function runAnalysis(filePath: string): AnomalyLog[] {
    logger.info(`Starting analysis for file: ${filePath}`);

    try {
        const transactions = readTransactionsFromFile(filePath);
        logger.info(`Successfully read ${transactions.length} transactions.`);

        const allAnomalies: AnomalyLog[] = [];

        for (const transaction of transactions) {
            const anomalies = checkAnomaliesForTransaction(transaction);
            if (anomalies.length > 0) {
                allAnomalies.push(...anomalies);
                anomalies.forEach(anomaly => {
                    logger.warn({ anomaly }, 'Anomaly Detected!');
                });
            }
        }

        if (allAnomalies.length > 0) {
            logger.info(`Analysis complete. Found ${allAnomalies.length} anomalies.`);
            // GỌI HÀM TẠO BÁO CÁO Ở ĐÂY
            generateTxtReport(allAnomalies, 'reports');
        } else {
            logger.info('Analysis complete. No anomalies found.');
        }

        return allAnomalies;

    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Analysis failed: ${error.message}`);
        } else {
            logger.error('Analysis failed due to an unknown error.');
        }
        return [];
    }
}