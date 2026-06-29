# DocumentManager SPEC

## 1. Mục Tiêu Dự Án
- Xây dựng một ứng dụng web quản lý văn bản đơn giản dạng single-page để dùng trong học tập/lớp học.
- Cho phép người dùng thêm, xem chi tiết, sửa (với thông báo cập nhật) và xóa văn bản.
- Hỗ trợ lưu trữ dữ liệu bằng `localStorage` để nội dung không bị mất sau khi tải lại trang.
- Giữ ứng dụng tĩnh, nhẹ, chạy trực tiếp bằng cách mở `index.html`.

## 2. Tính Năng
- **Thêm văn bản mới**: Cho phép nhập Tên văn bản, Loại văn bản, Phân loại, Ngày văn bản và Nội dung văn bản (trích yếu).
- **Xem chi tiết văn bản**: Hiển thị đầy đủ thông tin văn bản đã lưu trong một modal/cửa sổ xem chi tiết.
- **Sửa văn bản**: Chỉnh sửa văn bản đã có với biểu mẫu tương tự biểu mẫu thêm văn bản, hiển thị thông báo "Đã cập nhật thành công!" trong form trước khi đóng modal.
- **Xóa văn bản**: Xóa văn bản sau khi người dùng xác nhận ở hộp thoại/modal xác nhận xóa.
- **Tìm kiếm & Lọc thông minh (Bộ lọc trực tiếp)**: 
  - Ô tìm kiếm cho phép nhập từ khóa để tìm kiếm nhanh theo tiêu đề hoặc nội dung.
  - Các bộ lọc nâng cao bao gồm Loại văn bản, Phân loại, và Khoảng ngày văn bản (Từ ngày - Đến ngày) luôn hiển thị trực tiếp bên dưới ô tìm kiếm để lọc kết quả nhanh chóng.
- **Thống kê cơ bản**: Hiển thị tổng số văn bản hiện có và số lượng kết quả tìm kiếm/lọc hiện tại.
- **Lưu trữ dữ liệu**: Tự động khôi phục dữ liệu từ `localStorage` khi khởi động và tự cập nhật sau mỗi thao tác tạo/sửa/xóa.

## 3. Giao Diện Người Dùng
- **Header**: Tên ứng dụng và mô tả ngắn.
- **Khu vực thống kê**: Hiển thị tổng số tài liệu và số kết quả tìm kiếm.
- **Khung tìm kiếm & bộ lọc**:
  - Ô tìm kiếm chính để nhập từ khóa.
  - Bộ lọc trực tiếp: Loại văn bản (Select), Phân loại (Select), và Khoảng ngày văn bản (Input date Từ ngày và Đến ngày) luôn luôn hiển thị trực tiếp.
- **Danh sách tài liệu**:
  - Header của danh sách chứa tiêu đề "Danh sách tài liệu" và nút `[+ Thêm/Nhập tài liệu]`.
  - Mỗi mục trong danh sách hiển thị: Tiêu đề văn bản, các badges thông tin (loại, phân loại, ngày), tóm tắt/trích yếu nội dung (1-2 dòng) và các nút chức năng `[Xem]`, `[Sửa]`, `[Xóa]`.
  - Hiển thị Empty State nếu không có văn bản nào phù hợp.

Sơ đồ giao diện:

```text
+------------------------------------------------------+
|                  DocumentManager                     |
|      Ứng dụng quản lý tài liệu đơn giản              |
+------------------------------------------------------+

+----------------------+------------------------------+
| Tổng tài liệu        | Kết quả tìm kiếm             |
+----------------------+------------------------------+

+------------------------------------------------------+
| Tìm kiếm tài liệu                                    |
| [ Nhập tiêu đề hoặc thông tin tìm kiếm... ]          |
|                                                      |
| Loại văn bản       Phân loại         Từ ngày          Đến ngày      |
| [ Tất cả    v ]    [ Tất cả  v ]     [ dd/mm/yyyy ]   [ dd/mm/yyyy ]|
+------------------------------------------------------+

+------------------------------------------------------+
| Danh sách tài liệu             [+ Thêm/Nhập tài liệu]|
|------------------------------------------------------|
| Tiêu đề tài liệu                                     |
| [Loại văn bản] [Phân loại] [Ngày văn bản]            |
| Nội dung xem trước khoảng 1-2 dòng...                |
|                                     [Xem] [Sửa] [Xóa]|
|------------------------------------------------------|
| ...                                                  |
+------------------------------------------------------+

Chưa có tài liệu nào. (Empty State)
```

### Modal Thêm/Sửa tài liệu
```text
+--------------------------------------------------+
| Thêm tài liệu / Sửa tài liệu                     |
|--------------------------------------------------|
| Tên văn bản (*)                                  |
| [______________________________________________] |
|                                                  |
| Loại văn bản (*)          Phân loại (*)          |
| [ Công văn       v ]      [ Bản kiểm điểm   v ]  |
|                                                  |
| Ngày văn bản (*)                                 |
| [ dd/mm/yyyy ]                                   |
|                                                  |
| Nội dung văn bản (Trích yếu)                     |
| [                                              ] |
| [                                              ] |
|                                                  |
| <!-- Chỉ có trong form sửa khi bấm Lưu -->       |
| [* Đã cập nhật thành công!]                      |
|                                                  |
|                [Lưu]     [Hủy]                   |
+--------------------------------------------------+
```

### Modal Xem chi tiết tài liệu
```text
+--------------------------------------------------+
| Chi tiết văn bản                                 |
|--------------------------------------------------|
| Tên văn bản: [Tên văn bản hiển thị ở đây]        |
| Loại văn bản: [Loại văn bản]                     |
| Phân loại: [Phân loại]                           |
| Ngày văn bản: [Ngày văn bản]                     |
|                                                  |
| Nội dung trích yếu:                              |
| [Nội dung đầy đủ được hiển thị ở đây...]         |
|                                                  |
|                    [Đóng]                        |
+--------------------------------------------------+
```

### Modal Xóa tài liệu
```text
+--------------------------------------------------+
| Xóa tài liệu                                     |
|--------------------------------------------------|
| Bạn có chắc muốn xóa tài liệu này không?         |
|                                                  |
|                 [Xóa]     [Hủy]                  |
+--------------------------------------------------+
```

## 4. Yêu Cầu Chức Năng
- Ứng dụng phải tải dữ liệu từ `localStorage` khi khởi động.
- Các trường bắt buộc gồm: Tên văn bản, Loại văn bản, Phân loại, Ngày văn bản. Tiêu đề không được để trống hoặc chỉ có khoảng trắng.
- Mỗi tài liệu phải có các trường `id`, `title`, `type`, `category`, `date`, và `content`.
- Khi nhấn nút "Lưu" trong Form sửa: hiển thị thông báo "Đã cập nhật thành công!" trong modal sửa trước khi đóng modal sau khoảng 1 giây.
- **Tìm kiếm & Lọc kết hợp**: Ứng dụng phải kết hợp các điều kiện lọc (sử dụng phép toán AND) và hiển thị kết quả khớp:
  - Lọc theo ô tìm kiếm `#search-input` (tìm kiếm theo tiêu đề hoặc nội dung trích yếu, không phân biệt hoa/thường).
  - Lọc theo Loại văn bản `#filter-type` (nếu chọn khác "Tất cả").
  - Lọc theo Phân loại `#filter-category` (nếu chọn khác "Tất cả").
  - Lọc theo Khoảng ngày văn bản từ `#filter-date-from` đến `#filter-date-to` (so sánh chuỗi ngày YYYY-MM-DD).
- Mục thống kê "Kết quả tìm kiếm" phải cập nhật theo đúng số lượng kết quả đã lọc. Nếu không có bộ lọc/tìm kiếm nào đang được kích hoạt (ô tìm kiếm rỗng và các bộ lọc ở trạng thái mặc định), hiển thị "-".
- Lưu thay đổi vào `localStorage` sau mỗi thao tác thêm, sửa và xóa.

## 5. Mô Hình Dữ Liệu
Mỗi tài liệu có cấu trúc:
```json
{
  "id": 1719400000000,
  "title": "Báo cáo tiến độ lớp học tuần 25",
  "type": "Báo cáo",
  "category": "Hành chính",
  "date": "2026-06-29",
  "content": "Báo cáo chi tiết về tình hình học tập và chuyên cần của học sinh..."
}
```

| Thuộc tính | Kiểu | Mô tả |
|------------|------|-------|
| id | Number | Sinh tự động bằng `Date.now()` |
| title | String | Tên văn bản, bắt buộc |
| type | String | Loại văn bản: Công văn, Quyết định, Hợp đồng, Đơn, Kế hoạch, Biên bản, Khác |
| category | String | Phân loại: Bản kiểm điểm, Báo cáo, Giấy mời, Hành chính, Khác |
| date | String | Ngày văn bản dạng `YYYY-MM-DD`, bắt buộc |
| content | String | Nội dung văn bản (trích yếu), tùy chọn |

Key lưu trong `localStorage`: `documentmanager_documents`

## 6. HTML Contract
`index.html` phải sử dụng các selector sau:

| Thành phần             | Selector/ID |
|------------------------|-------------|
| Ô tìm kiếm chính       | `#search-input` |
| Lọc loại văn bản       | `#filter-type` |
| Lọc phân loại          | `#filter-category` |
| Lọc ngày bắt đầu       | `#filter-date-from` |
| Lọc ngày kết thúc      | `#filter-date-to` |
| Nút thêm tài liệu      | `#add-document-btn` |
| Danh sách tài liệu     | `#document-list` |
| Trạng thái trống       | `#empty-state` |
| Tổng tài liệu          | `#stats-total` |
| Kết quả tìm kiếm       | `#stats-result` |
| Modal thêm             | `#add-document-modal` |
| Modal sửa              | `#edit-document-modal` |
| Modal xem chi tiết     | `#view-document-modal` |
| Modal xóa              | `#delete-document-modal` |
| Form thêm              | `#add-document-form` |
| Form sửa               | `#edit-document-form` |
| Thông báo sửa thành công| `#edit-success-msg` |

Các trường input cụ thể:
- Thêm: `#add-title`, `#add-type`, `#add-category`, `#add-date`, `#add-content`
- Sửa: `#edit-title`, `#edit-type`, `#edit-category`, `#edit-date`, `#edit-content`
- Xem: `#view-title`, `#view-type`, `#view-category`, `#view-date`, `#view-content`

## 7. Yêu Cầu Phi Chức Năng
- Chạy trực tiếp trên trình duyệt khi mở `index.html` không cần môi trường build.
- Sử dụng HTML5, CSS3, Vanilla JS và `localStorage`.
- Giao diện đáp ứng (responsive), hoạt động tốt trên cả máy tính và điện thoại di động.
- Mã nguồn sạch sẽ, xử lý an toàn lỗi dữ liệu trong localStorage.

## 8. Công Nghệ Sử Dụng
- HTML5, CSS3, Vanilla JavaScript (ES6+), `localStorage`.

## 9. Cấu Trúc Dự Án
```text
DocumentManager/
├── SPEC.md
├── index.html
├── css/
│   └── styles.css
└── js/
    ├── app.js
    └── storage.js
```

## 10. Quy Trình Vibe Coding
1. Cập nhật `SPEC.md`
2. Cập nhật `index.html`
3. Cập nhật `styles.css`
4. Cập nhật `app.js`
5. Kiểm thử & hoàn thiện

## 11. Checklist Kiểm Thử Thủ Công
- Mở `index.html` tải không lỗi.
- Thêm tài liệu mới với đầy đủ thông tin: tên, loại, phân loại, ngày, nội dung. Kiểm tra hiển thị trong danh sách.
- Nhấp vào nút `[Xem]` để hiển thị chi tiết các trường vừa nhập trong modal.
- Nhấp vào nút `[Sửa]`, sửa các thông tin, bấm "Lưu". Xác nhận có thông báo cập nhật thành công hiện ra và modal tự động đóng sau 1 giây.
- Thay đổi ô tìm kiếm hoặc các ô chọn bộ lọc Loại văn bản, Phân loại, Từ ngày, Đến ngày hiển thị trực tiếp để kiểm tra kết quả lọc tức thời.
- Kiểm tra các số liệu thống kê được cập nhật chuẩn xác.
- Xác nhận dữ liệu không bị mất sau khi refresh trang.

## 12. Tiêu Chí Hoàn Thành
- Tất cả các trường thông tin mới đã được tích hợp vào dữ liệu và biểu mẫu.
- Các bộ lọc tìm kiếm hoạt động đồng bộ và hiển thị trực tiếp.
- Thiết kế giao diện hài hòa, các modal Xem, Thêm, Sửa, Xóa đều hoạt động tốt.

## 13. Enhancement Roadmap
- Đính kèm tệp PDF chọn từ máy tính, chuyển đổi sang Base64 và lưu trữ trong LocalStorage (giới hạn dung lượng < 2MB).
- Xem trực tiếp nội dung PDF đính kèm trong modal xem chi tiết.
- Thêm phân trang hoặc tìm kiếm nâng cao theo toàn văn (full-text search).
- Cho phép xuất/nhập danh sách văn bản sang tệp JSON để sao lưu.
