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
            return { isValid: false, message: 'Lỗi kiểm tra: File Excel không có sheet nào.' };
        }

        const worksheet = workbook.Sheets[sheetName];

        if (!worksheet) {
            return { 
                isValid: false, 
                message: `Lỗi kiểm tra: Không tìm thấy sheet tên "${sheetName}".` 
            };
        }
        
        const headers: string[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0] as string[];

        if (!headers || headers.length === 0) {
            return { isValid: false, message: 'Lỗi kiểm tra: Sheet đầu tiên trống hoặc không có dòng tiêu đề.' };
        }

        // Kiểm tra xem tất cả các cột bắt buộc có tồn tại trong header không
        for (const requiredHeader of REQUIRED_HEADERS) {
            if (!headers.includes(requiredHeader)) {
                return { 
                    isValid: false, 
                    message: `Lỗi kiểm tra: Thiếu cột bắt buộc -> "${requiredHeader}"` 
                };
            }
        }

        return { isValid: true };

    } catch (error) {
        return { isValid: false, message: 'Lỗi kiểm tra: Không thể đọc hoặc phân tích file.' };
    }
}