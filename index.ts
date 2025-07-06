// src/index.ts
import minimist from 'minimist';
import logger from './src/utils/logger';
import { validateExcelFile } from './src/core/fileValidator';
import { runAnalysis } from './src/services/analysis.service';

// Hàm chính để chạy tool
function main() {
    // Dùng minimist để xử lý các tham số dòng lệnh
    const args = minimist(process.argv.slice(2));
    const filePath = args.file;

    // Kiểm tra xem người dùng đã cung cấp đường dẫn file chưa
    if (!filePath) {
        logger.error('Thiếu đường dẫn file. Vui lòng truyền tham số --file để chỉ định file cần phân tích.');
        logger.info('Ví dụ: bun analyze --file "data/transactions.xlsx"');
        process.exit(1); // exit chương trình với error code
    }

    logger.info(`Nhận yêu cầu phân tích file: ${filePath}`);

    // validate file
    const validationResult = validateExcelFile(filePath);
    if (!validationResult.isValid) {
        logger.error(validationResult.message);
        process.exit(1);
    }

    logger.info('✅ Cấu trúc file hợp lệ.');

    // run analysis
    logger.info('Bắt đầu phân tích...');
    runAnalysis(filePath);

}

// Chạy hàm chính
main();