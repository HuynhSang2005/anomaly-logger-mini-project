// src/index.ts
import minimist from 'minimist';
import logger from './src/utils/logger';

// Hàm chính để chạy tool
function main() {
    // Dùng minimist để xử lý các tham số dòng lệnh
    const args = minimist(process.argv.slice(2));
    const filePath = args.file;

    // Kiểm tra xem người dùng đã cung cấp đường dẫn file chưa
    if (!filePath) {
        logger.error('File path is required. Please provide the file path using the --file argument.');
        logger.info('Example: bun analyze --file "data/transactions.xlsx"');
        process.exit(1); // Thoát chương trình với mã lỗi
    }

    logger.info(`Received request to analyze file: ${filePath}`);

    // Các bước kiểm tra và phân tích sẽ được thêm vào đây
}

// Chạy hàm chính
main();