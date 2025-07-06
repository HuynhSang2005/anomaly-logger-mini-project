import * as XLSX from 'xlsx';

// List các columns bắt buộc phải có trong file Excel (hard columns)
const REQUIRED_HEADERS = [
    'TransactionID',
    'CustomerID',
    'Timestamp',
    'TransactionType',
    'Amount',
    'BalanceBefore',
    'BalanceAfter'
];

interface ValidationResult {
    isValid: boolean;
    message?: string;
}

export function validateExcelFile(filePath: string): ValidationResult {
    try {
        const workbook = XLSX.readFile(filePath, { sheetRows: 1 }); // Chỉ đọc hàng đầu tiên để tối ưu
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
            return { isValid: false, message: 'Validation Error: Excel file contains no sheets.' };
        }

        const worksheet = workbook.Sheets[sheetName];

        if (!worksheet) {
            return { 
                isValid: false, 
                message: `Validation Error: Sheet with name "${sheetName}" could not be found.` 
            };
        }
        
        const headers: string[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0] as string[];

        if (!headers || headers.length === 0) {
            return { isValid: false, message: 'Validation Error: The first sheet is empty or has no header row.' };
        }

        // Kiểm tra xem tất cả các cột bắt buộc có tồn tại trong header không
        for (const requiredHeader of REQUIRED_HEADERS) {
            if (!headers.includes(requiredHeader)) {
                return { 
                    isValid: false, 
                    message: `Validation Error: Missing required column -> "${requiredHeader}"` 
                };
            }
        }

        return { isValid: true };

    } catch (error) {
        return { isValid: false, message: 'Validation Error: Could not read or parse the file.' };
    }
}