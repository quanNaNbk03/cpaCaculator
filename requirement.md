# MÔ TẢ Ý TƯỞNG DỰ ÁN: CÔNG CỤ TÍNH CPA & DỰ BÁO ĐIỂM SINH VIÊN

## 1. Tổng quan bài toán
Tôi muốn xây dựng một web application đơn giản, phục vụ sinh viên đại học theo hệ tín chỉ.
Vấn đề của sinh viên là họ thường xuyên muốn biết:
1.  **CPA hiện tại:** Điểm trung bình tích lũy tính đến thời điểm này.
2.  **Dự báo (Forecasting):** Quan trọng nhất, họ muốn biết với số tín chỉ còn lại chưa học, họ phải đạt trung bình bao nhiêu điểm nữa để kéo CPA lên mức mong muốn (ví dụ: từ Khá lên Giỏi, từ Giỏi lên Xuất sắc).

Tool này cần chạy hoàn toàn ở phía Client (trình duyệt), không cần Backend phức tạp, để sau này dễ dàng deploy lên các nền tảng static hosting như Vercel/Netlify.

## 2. Yêu cầu chức năng (Functional Requirements)

### A. Nhập liệu (Input)
Hệ thống cần hỗ trợ 2 cách nhập dữ liệu linh hoạt:
1.  **Nhập thủ công (Manual Input):**
    -   Người dùng nhập từng dòng: Tên môn học, Số tín chỉ, Điểm số (thang 4 hoặc thang 10 quy đổi).
    -   Có nút "Thêm môn học" để thêm dòng mới.
    -   Có thể sửa/xóa các dòng đã nhập.
2.  **Nhập từ File (Import Excel):**
    -   Hỗ trợ upload file `.xlsx` hoặc `.csv` mà sinh viên thường xuất ra từ cổng thông tin đào tạo.
    -   Hệ thống tự động đọc file và map vào bảng dữ liệu.

### B. Cấu hình mục tiêu (Target Configuration)
Người dùng cần nhập các thông số đầu vào cố định của khóa học:
-   **Tổng số tín chỉ toàn khóa:** (Ví dụ: 150 tín chỉ).
-   **Mục tiêu mong muốn:** Chọn loại bằng (Khá, Giỏi, Xuất sắc) hoặc nhập một con số CPA cụ thể (Ví dụ: 3.6).

### C. Xử lý & Tính toán (Core Logic)
Hệ thống cần tính toán realtime các thông số sau:
-   `Current CPA`: Tổng điểm tích lũy / Tổng tín chỉ đã học.
-   `Remaining Credits`: Tổng tín chỉ toàn khóa - Tổng tín chỉ đã học.
-   `Required Score`: Điểm trung bình cần đạt cho các môn còn lại để đạt Mục tiêu.
    -   *Logic:* (Điểm Mục tiêu * Tổng tín chỉ toàn khóa - Điểm Tích lũy hiện tại) / Số tín chỉ còn lại.

### D. Hiển thị kết quả (Output Dashboard)
Giao diện cần hiển thị rõ ràng:
-   Con số CPA hiện tại.
-   Thanh tiến độ (Progress bar) thể hiện chặng đường đã đi được.
-   **Thông báo dự báo:** Ví dụ: "Bạn còn **20** tín chỉ. Để đạt bằng Giỏi (3.2), các môn còn lại bạn phải đạt trung bình **3.5** điểm."
-   Cảnh báo nếu mục tiêu là "Không thể đạt được" (ví dụ cần > 4.0 điểm).

## 3. Yêu cầu công nghệ (Tech Stack)

Để đảm bảo hiệu năng cao, giao diện mượt mà và code dễ bảo trì, tôi chọn stack sau:
-   **Ngôn ngữ:** TypeScript (để quản lý kiểu dữ liệu điểm số, tín chỉ chặt chẽ).
-   **Framework:** Next.js (sử dụng App Router mới nhất).
-   **Styling:** Tailwind CSS (ưu tiên sử dụng thư viện component như Shadcn/UI hoặc Ant Design cho nhanh).
-   **Xử lý Excel:** Thư viện `xlsx` (SheetJS).
-   **Quản lý State:** Sử dụng `Zustand` hoặc React Context API để lưu mảng danh sách môn học.

## 4. Kiến trúc Source Code dự kiến (Project Structure)

Dự án nên được tổ chức theo cấu trúc `src/` của Next.js, phân chia rõ ràng giữa giao diện và logic tính toán:

```text
src/
├── app/
│   ├── page.tsx            # Giao diện chính (Dashboard)
│   ├── layout.tsx          # Layout chung
│   └── globals.css         # Cấu hình Tailwind
├── components/
│   ├── ui/                 # Các component cơ bản (Button, Input, Card...)
│   ├── Calculator/         # Các component chức năng chính
│   │   ├── SubjectList.tsx # Bảng hiển thị danh sách môn học
│   │   ├── InputForm.tsx   # Form nhập liệu thủ công
│   │   ├── ExcelImport.tsx # Khu vực upload file Excel
│   │   └── SummaryCard.tsx # Thẻ hiển thị kết quả CPA và Dự báo
├── lib/
│   ├── calculator.ts       # Chứa toàn bộ hàm logic tính toán toán học (CPA, Forecast)
│   ├── excelHelper.ts      # Chứa hàm xử lý đọc/ghi file Excel
│   └── utils.ts            # Các hàm tiện ích format số, chuỗi
├── types/
│   └── index.ts            # Định nghĩa các interface (Subject, Semester, UserGoal...)
└── constants/
    └── grades.ts           # Định nghĩa các mốc điểm (Giỏi=3.2, Xuất sắc=3.6...)