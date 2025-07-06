import * as XLSX from 'xlsx';
import type { Transaction } from '../types';

export function readTransactionsFromFile(filePath: string): Transaction[] {
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0]; // Lấy sheet đầu tiên

        // Nếu không tìm thấy sheet nào trong file sẽ throw error
        if (!sheetName) {
            throw new Error("File Excel không có sheet nào hoặc đang trống.");
        }

        const worksheet = workbook.Sheets[sheetName];

        if (!worksheet) {
            throw new Error(`Không tìm thấy sheet tên "${sheetName}" trong file Excel.`);
        }

        // convert sheet thành array JSON với kiểu Transaction
        const data = XLSX.utils.sheet_to_json<Transaction>(worksheet);
        return data;

    } catch (error) {
        if (error instanceof Error) {
            console.error(`❌ Lỗi khi đọc file Excel: ${error.message}`);
            // Ném lại error để bên ngoài có thể bắt được
            throw error;
        }
        // error không xác định
        throw new Error(`Đã xảy ra lỗi không xác định khi đọc file: ${filePath}`);
    }
}