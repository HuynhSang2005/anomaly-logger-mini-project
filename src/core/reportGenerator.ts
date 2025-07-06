// src/core/reportGenerator.ts
import fs from 'fs';
import path from 'path';
import logger from '../utils/logger';
import type { AnomalyLog } from '../types';

export function generateTxtReport(anomalies: AnomalyLog[], outputDir: string): void {
    if (anomalies.length === 0) {
        logger.info('No anomalies to report. Skipping report generation.');
        return;
    }

    // Tạo tên file với timestamp để không bị ghi đè
    const now = new Date();
    const timestamp = now.toISOString().replace(/:/g, '-').slice(0, 19);
    const fileName = `anomaly_report_${timestamp}.txt`;
    const filePath = path.join(outputDir, fileName);

    // Xây dựng nội dung báo cáo
    let reportContent = `===================================================\n`;
    reportContent += `  BÁO CÁO GIAO DỊCH BẤT THƯỜNG\n`;
    reportContent += `  Thời gian xuất: ${now.toLocaleString('vi-VN')}\n`;
    reportContent += `===================================================\n\n`;
    reportContent += `Tổng số bất thường phát hiện: ${anomalies.length}\n\n`;
    reportContent += `---------------------------------------------------\n\n`;

    anomalies.forEach((anomaly, index) => {
        reportContent += `${index + 1}.\tLoại bất thường: ${anomaly.ruleViolated}\n`;
        reportContent += `\tMã Giao Dịch:   ${anomaly.transactionId}\n`;
        reportContent += `\tMã Khách Hàng:  ${anomaly.customerId}\n`;
        reportContent += `\tChi tiết:         ${anomaly.details}\n`;
        reportContent += `\tThời gian phát hiện: ${new Date(anomaly.timestamp).toLocaleString('vi-VN')}\n\n`;
    });

    try {
        // Đảm bảo thư mục tồn tại trước khi ghi file
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        fs.writeFileSync(filePath, reportContent);
        logger.info(`✅ Successfully generated report at: ${filePath}`);
    } catch (error) {
        logger.error(`Failed to write report file: ${error}`);
    }
}