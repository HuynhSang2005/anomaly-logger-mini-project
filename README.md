<p align="center">
  <img src="https://bun.sh/logo.svg" width="120" alt="Bun.js Logo" />
</p>

# Công Cụ Ghi Nhận Giao Dịch Bất Thường (Anomaly Logger)

![Bun](https://img.shields.io/badge/Bun-1.1.20-%23000000)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-%233178C6)
![Pino](https://img.shields.io/badge/pino.js-9.7.0-blue)
![xlsx](https://img.shields.io/badge/xlsx-0.18.5-brightgreen)

Đây là một dự án mini xây dựng công cụ dòng lệnh (CLI) bằng **Bun.js** và **TypeScript** để tự động phân tích các file giao dịch Excel, phát hiện những giao dịch bất thường dựa trên một bộ quy tắc được định sẵn và xuất báo cáo chi tiết.

## 🌟 Tổng quan

Công cụ này được thiết kế để giải quyết bài toán sàng lọc dữ liệu giao dịch tài chính, giúp nhanh chóng xác định các hoạt động đáng ngờ. Nó nhận đầu vào là một file Excel, kiểm tra tính hợp lệ của cấu trúc file, sau đó áp dụng các quy tắc để phát hiện bất thường và cuối cùng tạo ra một báo cáo văn bản (`.txt`) để lưu trữ.

### Các tính năng chính

* **Phân tích Dữ liệu từ Excel**: Đọc và xử lý dữ liệu trực tiếp từ các file `.xlsx`.
* **Kiểm tra Cấu trúc File**: Đảm bảo file đầu vào tuân thủ đúng định dạng yêu cầu trước khi xử lý.
* **Phát hiện Bất thường theo Quy tắc**:
    * Phát hiện giao dịch có giá trị **lớn bất thường**.
    * Phát hiện các trường hợp **số dư bị âm** sau giao dịch.
    * Phát hiện các **sai lệch trong tính toán** số dư.
* **Logging chuyên nghiệp**: Sử dụng `pino` và `pino-pretty` để ghi log quá trình một cách rõ ràng, đẹp mắt.
* **Xuất Báo cáo**: Tự động tạo file báo cáo `.txt` chi tiết về các bất thường đã phát hiện, kèm theo timestamp.
* **Tạo dữ liệu mẫu**: Cung cấp script để tự động tạo file dữ liệu giao dịch giả lập cho việc kiểm thử.

---

## 🛠️ Hướng dẫn Cài đặt và Cấu hình

### Yêu cầu

* [Bun.js](https://bun.sh/) (phiên bản 1.0 trở lên)

### Các bước cài đặt

1.  **Clone repository về máy:**
    ```bash
    git clone <URL_CUA_REPO_BAN>
    cd anomaly-logger-mini-project
    ```

2.  **Cài đặt các gói phụ thuộc:**
    Bun sẽ tự động đọc file `package.json` và cài đặt tất cả các thư viện cần thiết.
    ```bash
    bun install
    ```

3.  **(Tùy chọn) Tạo dữ liệu mẫu:**
    Nếu bạn chưa có file giao dịch, hãy chạy script sau để tạo một file `transactions.xlsx` mẫu trong thư mục `data/`.
    ```bash
    bun run generate-data.ts
    ```

---

## 🚀 Cách Sử dụng

Công cụ được chạy thông qua dòng lệnh. Bạn cần cung cấp đường dẫn đến file Excel cần phân tích bằng tham số `--file`.

### Cú pháp cơ bản

```bash
bun run analyze --file "<duong_dan_den_file_excel>"
````

### Ví dụ

Giả sử bạn đã tạo file dữ liệu mẫu ở bước cài đặt, file này sẽ nằm ở `data/transactions.xlsx`.

```bash
bun run analyze --file "data/transactions.xlsx"
```

### Kết quả mong đợi

1.  **Trên Terminal**: Bạn sẽ thấy các log về quá trình làm việc của công cụ, từ việc kiểm tra file, đọc dữ liệu, cho đến các cảnh báo về những bất thường được phát hiện.
2.  **File Báo cáo**: Nếu có bất thường, một thư mục mới tên là `reports` sẽ được tạo ra. Bên trong sẽ có một file `.txt` (ví dụ: `anomaly_report_2025-07-06-15-30-00.txt`) chứa báo cáo chi tiết.

-----

## 🧩 Các Module Chính

Dự án được cấu trúc thành các module rõ ràng trong thư mục `src/`.

### `src/core` - Lõi xử lý

  * **`anomalyDetector.ts`**: Đây là "bộ não" của ứng dụng, chứa logic để kiểm tra một giao dịch có vi phạm các quy tắc hay không (giao dịch lớn, số dư âm, sai lệch tính toán).
  * **`dataReader.ts`**: Chịu trách nhiệm đọc và chuyển đổi dữ liệu từ file Excel thành các đối tượng JavaScript/TypeScript.
  * **`fileValidator.ts`**: Kiểm tra xem file Excel đầu vào có đúng cấu trúc (đủ các cột tiêu đề bắt buộc) trước khi xử lý.
  * **`reportGenerator.ts`**: Chịu trách nhiệm tạo file báo cáo văn bản `.txt` từ danh sách các bất thường đã được phát hiện.

### `src/services` - Tầng dịch vụ

  * **`analysis.service.ts`**: Đóng vai trò "nhạc trưởng", điều phối hoạt động của các module trong `core`. Nó gọi `fileValidator`, `dataReader`, `anomalyDetector`, và `reportGenerator` theo đúng trình tự để hoàn thành một luồng phân tích.

### `src/utils` - Các tiện ích

  * **`logger.ts`**: Cấu hình thư viện `pino` để tạo ra một logger có thể tái sử dụng trong toàn bộ dự án, giúp việc ghi log nhất quán và chuyên nghiệp.

### `src/types` - Định nghĩa kiểu

  * **`index.ts`**: Định nghĩa các `interface` của TypeScript như `Transaction` và `AnomalyLog`, giúp đảm bảo an toàn kiểu dữ liệu và tăng khả năng gợi ý code.

-----

## 🤔 Hạn chế & Bài học Rút ra

Quá trình xây dựng dự án này không chỉ tạo ra một sản phẩm mà còn mang lại nhiều bài học giá trị.

### Hạn chế của Dự án

  * **Hiệu năng với file lớn**: Công cụ hiện tại đọc toàn bộ file Excel vào bộ nhớ. Với các file dữ liệu cực lớn (hàng triệu dòng), cách tiếp cận này có thể gây tốn bộ nhớ và chậm. Một giải pháp nâng cao hơn là xử lý file theo dòng (stream processing).
  * **Quy tắc Cố định**: Các quy tắc phát hiện bất thường đang được viết cứng (hard-coded) trong module `anomalyDetector.ts`. Một hệ thống linh hoạt hơn có thể cho phép người dùng định nghĩa quy tắc qua một file cấu hình (JSON, YAML) hoặc từ giao diện.
  * **Xử lý Tuần tự**: Các giao dịch được xử lý một cách tuần tự. Việc áp dụng xử lý song song (parallel processing) có thể tăng tốc độ phân tích trên các máy có nhiều nhân CPU.

### Bài học Rút ra từ Quá trình Phát triển

  * **Tầm quan trọng của Cấu trúc Dự án**: Việc phân chia code thành các thư mục `core`, `services`, `utils`, `types` ngay từ đầu giúp dự án trở nên rõ ràng, dễ bảo trì và mở rộng. Khi cần sửa lỗi hoặc thêm tính năng, chúng ta biết chính xác cần tìm ở đâu.
  * **Sức mạnh của Lập trình Module hóa**: Thay vì viết một file lớn, việc chia nhỏ logic thành các module có trách nhiệm duy nhất (`dataReader`, `fileValidator`, `reportGenerator`) giúp code sạch hơn, dễ đọc và quan trọng nhất là dễ kiểm thử (test) một cách độc lập.
  * **Giá trị của TypeScript**: Quá trình làm việc đã cho thấy lợi ích rõ rệt của TypeScript. Các lỗi như `undefined` khi đọc file Excel đã được phát hiện ngay ở giai đoạn viết code, thay vì trở thành lỗi tiềm ẩn khi chương trình chạy, giúp tiết kiệm rất nhiều thời gian gỡ lỗi.
  * **Tự động hóa là Chìa khóa**: Script `generate-data.ts` là một ví dụ điển hình cho việc tự động hóa một công việc nhàm chán và dễ sai sót. Nó không chỉ giúp tạo dữ liệu nhanh chóng mà còn đảm bảo dữ liệu luôn có các trường hợp bất thường cần thiết để kiểm thử.

