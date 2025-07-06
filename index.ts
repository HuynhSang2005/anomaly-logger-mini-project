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
        logger.error('File path is required. Please provide the file path using the --file argument.');
        logger.info('Example: bun analyze --file "data/transactions.xlsx"');
        process.exit(1); // exit chương trình với error code
    }

    logger.info(`Received request to analyze file: ${filePath}`);

    // validate file
    const validationResult = validateExcelFile(filePath);
    if (!validationResult.isValid) {
        logger.error(validationResult.message);
        process.exit(1);
    }

    logger.info('✅ File structure is valid.');

    // run analysis
    logger.info('Starting analysis...');
    runAnalysis(filePath);

}

// Chạy hàm chính
main();