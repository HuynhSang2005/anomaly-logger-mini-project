import * as XLSX from 'xlsx';
import type { Transaction } from '../types';

export function readTransactionsFromFile(filePath: string): Transaction[] {
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0]; // Lấy sheet đầu tiên

        // Nếu không tìm thấy sheet nào trong file sẽ throw error
        if (!sheetName) {
            throw new Error("The Excel file is empty or does not contain any sheets.");
        }

        const worksheet = workbook.Sheets[sheetName];

        if (!worksheet) {
            throw new Error(`Sheet with name "${sheetName}" not found in the workbook.`);
        }

        // convert sheet thành array JSON với kiểu Transaction
        const data = XLSX.utils.sheet_to_json<Transaction>(worksheet);
        return data;

    } catch (error) {
        if (error instanceof Error) {
            console.error(`❌ Error reading Excel file: ${error.message}`);
            // Ném lại error để bên ngoài có thể bắt được
            throw error;
        }
        // error không xác định
        throw new Error(`An unknown error occurred while reading file at: ${filePath}`);
    }
}