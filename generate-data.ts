// generate-data.ts do AI tạo =)))))

import { Faker, en } from '@faker-js/faker';
import * as XLSX from 'xlsx';
import fs from 'fs';

// CẤU HÌNH 
const NUMBER_OF_CUSTOMERS = 10;
const NUMBER_OF_TRANSACTIONS = 100;
const OUTPUT_FILE_PATH = './data/transactions.xlsx';

// KHỞI TẠO
const faker = new Faker({ locale: [en] });

interface Customer {
    id: string;
    balance: number;
}

// Tạo ra một danh sách khách hàng ảo với số dư ban đầu
const customers: Map<string, Customer> = new Map();
for (let i = 1; i <= NUMBER_OF_CUSTOMERS; i++) {
    const customerId = `CUS${String(i).padStart(3, '0')}`;
    customers.set(customerId, {
        id: customerId,
        balance: faker.number.int({ min: 5_000_000, max: 200_000_000 }),
    });
}

const transactions = [];
let lastTimestamp = new Date('2025-07-01T09:00:00Z');

// VÒNG LẶP TẠO GIAO DỊCH
console.log('🔄 Generating transactions...');
for (let i = 0; i < NUMBER_OF_TRANSACTIONS; i++) {
    const customerIds = Array.from(customers.keys());
    const randomCustomerId = faker.helpers.arrayElement(customerIds);
    const customer = customers.get(randomCustomerId)!;

    const transactionType = faker.helpers.arrayElement(['IN', 'OUT']);
    let amount = faker.number.int({ min: 50_000, max: 5_000_000 });
    const balanceBefore = customer.balance;
    let balanceAfter = 0;

    // Tiến tới một chút thời gian cho giao dịch tiếp theo
    lastTimestamp.setMinutes(lastTimestamp.getMinutes() + faker.number.int({ min: 1, max: 60 }));

    // CỐ TÌNH TẠO RA DỮ LIỆU BẤT THƯỜNG
    const anomalyChance = Math.random();
    let isAnomaly = false;

    // 1. Giao dịch cực lớn (5% cơ hội)
    if (anomalyChance < 0.05) {
        amount = faker.number.int({ min: 150_000_000, max: 500_000_000 });
        isAnomaly = true;
    }

    // Tính toán số dư
    if (transactionType === 'IN') {
        balanceAfter = balanceBefore + amount;
    } else {
        // 2. Giao dịch rút quá số dư (tạo ra số dư âm)
        if (amount > balanceBefore && !isAnomaly) {
            amount = faker.number.int({ min: balanceBefore + 1_000_000, max: balanceBefore + 5_000_000 });
        }
        balanceAfter = balanceBefore - amount;
    }

    // 3. Sai sót tính toán (5% cơ hội)
    if (anomalyChance > 0.95) {
        balanceAfter += 10000;
    }

    // Cập nhật lại số dư cho khách hàng
    customer.balance = balanceAfter;
    customers.set(customer.id, customer);

    transactions.push({
        TransactionID: `TXN${lastTimestamp.getTime()}`,
        CustomerID: customer.id,
        Timestamp: lastTimestamp.toISOString(),
        TransactionType: transactionType,
        Amount: amount,
        BalanceBefore: balanceBefore,
        BalanceAfter: balanceAfter,
    });
}

// GHI RA FILE EXCEL
console.log('✍️  Writing data to Excel file...');

const worksheet = XLSX.utils.json_to_sheet(transactions);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

// Tạo thư mục 'data' nếu chưa có
if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
}

XLSX.writeFile(workbook, OUTPUT_FILE_PATH);

console.log(`✅  Successfully generated ${NUMBER_OF_TRANSACTIONS} transactions at ${OUTPUT_FILE_PATH}`);