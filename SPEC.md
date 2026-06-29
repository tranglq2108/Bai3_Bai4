# TaskManager — Đặc tả dự án (Classroom Edition)

## 1. Mục tiêu dự án

Xây dựng một **phần mềm quản lý công việc đơn giản** chạy trên trình duyệt, phục vụ bài tập lớp học với HTML, CSS và JavaScript thuần.

Người dùng có thể:

- Thêm công việc cần làm.
- Chỉnh sửa tiêu đề công việc.
- Đánh dấu hoàn thành hoặc chưa làm.
- Xóa công việc.
- Tìm kiếm công việc theo tiêu đề.
- Dữ liệu được lưu cục bộ — không cần tài khoản hay máy chủ.

**Phạm vi:** Ứng dụng một trang (single-page), không đăng nhập, không đồng bộ đám mây.

### 1.1 Mục tiêu học tập

Sinh viên luyện các kỹ năng sau:

| Kỹ năng | Ứng dụng trong dự án |
|---------|----------------------|
| HTML semantic | Cấu trúc `header`, `main`, `form`, `ul/li` |
| CSS cơ bản | Layout Flexbox, trạng thái hover/active, responsive đơn giản |
| DOM manipulation | Tạo, cập nhật, xóa phần tử danh sách |
| Sự kiện (events) | `submit`, `click`, `change` |
| JavaScript cơ bản | Mảng, object, hàm, filter |
| `localStorage` | Lưu và khôi phục dữ liệu JSON |

### 1.2 Phân tầng nộp bài

| Tầng | Mô tả |
|------|-------|
| **Tầng 1 — Bắt buộc** | Đủ để nộp bài và đạt điểm cơ bản |
| **Tầng 2 — Tùy chọn** | Tính năng mở rộng, điểm cộng |

---

## 2. Tính năng

### 2.1 Tầng 1 — Bắt buộc

| # | Tính năng | Mô tả |
|---|-----------|-------|
| F1 | Thêm công việc | Nhập tiêu đề (bắt buộc), thêm vào đầu danh sách. |
| F2 | Xem danh sách | Hiển thị tiêu đề và trạng thái (checkbox). |
| F3 | Đánh dấu hoàn thành | Chuyển *Chưa làm* ↔ *Hoàn thành* bằng checkbox. |
| F4 | Chỉnh sửa công việc | Chỉnh sửa tiêu đề trong modal. |
| F5 | Xóa công việc | Xóa khỏi danh sách bằng modal xác nhận. |
| F6 | Tìm kiếm công việc | Người dùng nhập từ khóa để lọc danh sách theo tiêu đề theo thời gian thực.|
| F7 | Lưu trữ cục bộ | Lưu trong `localStorage`, khôi phục khi mở lại trang. |

### 2.2 Tầng 2 — Tùy chọn (điểm cộng)

| # | Tính năng | Mô tả |
|---|-----------|-------|
| F8 | Mô tả công việc | Thêm trường mô tả tùy chọn khi tạo task. |
| F9 | Hiển thị ngày tạo | Hiển thị ngày trên mỗi thẻ công việc. |
| F10 | Đếm công việc | Hiển thị "Còn X việc chưa làm" dưới form hoặc footer. |

### 2.3 Ngoài phạm vi

Đăng nhập, đồng bộ đám mây, deadline, nhãn (tags), kéo-thả sắp xếp, thông báo nhắc việc, backend, framework (React/Vue/…).

---

## 3. Giao diện người dùng

### 3.1 Bố cục tổng thể (Tầng 1)

```
┌─────────────────────────────────────────────┐
│               TaskManager                   │
├─────────────────────────────────────────────┤
│ Tổng   Chưa làm   Hoàn thành                │
├─────────────────────────────────────────────┤
│ [ Tìm công việc... ]           [ + Thêm ]   │
├─────────────────────────────────────────────┤
│ Danh sách công việc                         │
│ ☐ Học JavaScript               [Sửa] [Xóa] │
│ ☑ Nộp bài tập                  [Sửa] [Xóa] │
│                                             │
│ (Empty State nếu chưa có công việc)         │
└─────────────────────────────────────────────┘

```

### 3.2 Thành phần giao diện
| Thành phần               | Hành vi                                                    |
|--------------------------|------------------------------------------------------------|
| **Header**               | Hiển thị tên ứng dụng *TaskManager*.                       |
| **Thống kê**             | Hiển thị **Tổng công việc**, **Chưa làm**, **Hoàn thành**. Tự động cập nhật khi thêm, hoàn thành hoặc xóa task.                                                     |
| **Nút Thêm**  | Mở hộp thoại thêm công việc.  |
| **Form thêm** | Chỉ hiển thị bên trong modal. |
| **Danh sách công việc**  | Hiển thị toàn bộ công việc hiện có. Mỗi công việc gồm Checkbox, tiêu đề, nút **Sửa** và **Xóa**.                                                                      |
| **Modal thêm công việc** | Bấm **Thêm** → mở hộp thoại nhập tiêu đề công việc. Bấm **Lưu** để tạo task hoặc **Hủy** để đóng hộp thoại.                                                           |
| **Modal sửa công việc**  | Bấm **Sửa** → mở hộp thoại chỉnh sửa tiêu đề. Bấm **Lưu** để cập nhật hoặc **Hủy** để đóng hộp thoại.                                                                 |
| **Modal xác nhận xóa**   | Bấm **Xóa** → mở hộp thoại xác nhận. Bấm **Xóa** để xóa task hoặc **Hủy** để giữ nguyên.                                                                              |
| **Trạng thái rỗng**      | Hiển thị `#empty-state` khi chưa có công việc hoặc kết quả tìm kiếm không có task phù hợp. Nội dung mặc định: *"Chưa có công việc nào. Hãy thêm công việc đầu tiên!"* |


### 3.3 Thiết kế trực quan

- **Phong cách:** Tối giản, sạch, dễ đọc.
- **Màu sắc:** Nền sáng; một màu nhấn (xanh dương hoặc xanh lá) cho nút chính; xám cho task đã hoàn thành.
- **Typography:** Font sans-serif hệ thống (`system-ui`, `Segoe UI`, …).
- **Responsive:** Hiển thị ổn trên màn hình ≥ 360px (một cột, nút đủ lớn để chạm).

### 3.4 Hợp đồng HTML (Task 1)

`index.html` phải có các phần tử sau — JavaScript  dựa vào **id** và **class** này:

| Vùng          | Selector                           | Mục đích                  |
| Thanh công cụ | `#search-input`, `#add-task-btn`   | Tìm kiếm và mở modal thêm công việc |
| Thống kê      | `#stats-total`, `#stats-active`, `#stats-completed`    | Hiển thị thống kê         |
| Danh sách     | `#task-list`, `#empty-state`     | Container danh sách task  |
| Một task      | `.task-item`, `data-id`          | Mỗi công việc             |
| Checkbox      | `.task-item__checkbox`           | Đánh dấu hoàn thành       |
| Tiêu đề       | `.task-item__title`              | Hiển thị tiêu đề          |
| Nút sửa       | `.task-item__btn--edit`          | Mở modal sửa              |
| Nút xóa       | `.task-item__btn--delete`        | Mở modal xác nhận xóa     |
| Modal thêm    | `#add-task-modal`, `#add-task-input`, `#add-task-save`, `#add-task-cancel`  | Thêm công việc            |
| Modal sửa     | `#edit-task-modal`, `#edit-task-input`, `#edit-task-save`, `#edit-task-cancel` | Sửa công việc |
| Modal xóa     | `#delete-task-modal`, `#delete-task-confirm`, `#delete-task-cancel`| Xác nhận xóa   |
| Hoàn thành    | `.task-item--completed`        | CSS gạch ngang tiêu đề    |


## 4. Yêu cầu chức năng

### 4.1 Quản lý công việc (Tầng 1)

| ID | Yêu cầu | Tiêu chí chấp nhận |
|----|---------|-------------------|
| FR-01 | Thêm công việc | Tiêu đề không rỗng → task xuất hiện **đầu danh sách**, trạng thái *Chưa làm*. |
| FR-02 | Từ chối tiêu đề rỗng | Tiêu đề chỉ có khoảng trắng → không thêm; hiển thị thông báo lỗi ngắn (text hoặc border đỏ). |
| FR-03 | Giới hạn tiêu đề | Tiêu đề tối đa 100 ký tự; tự `trim()` khoảng trắng đầu/cuối. |
| FR-04 | Đánh dấu hoàn thành | Bật/tắt checkbox → cập nhật trạng thái và giao diện (gạch ngang tiêu đề). |
| FR-05 | Sửa công việc | Bấm Sửa → mở modal với dữ liệu hiện tại. Bấm Lưu → cập nhật tiêu đề. Bấm Hủy → đóng modal và không thay đổi dữ liệu. |
| FR-06 | Xóa công việc | Bấm Xóa → mở modal xác nhận. Bấm Xác nhận → xóa task khỏi danh sách. Bấm Hủy → đóng modal và giữ nguyên dữ liệu.|

### 4.2 Lọc (Tầng 1)

| ID | Yêu cầu | Tiêu chí chấp nhận |
|----|---------|-------------------|
|FR-07 | Tìm kiếm theo tiêu đề | Người dùng nhập từ khóa; danh sách cập nhật theo thời gian thực; không phân biệt chữ hoa/thường; nếu không có kết quả thì hiển thị Empty State.|

### 4.3 Lưu trữ (Tầng 1)

| ID | Yêu cầu | Tiêu chí chấp nhận |
|----|---------|-------------------|
| FR-08 | Lưu tự động | Mọi thay đổi (thêm/sửa/xóa/toggle) ghi vào `localStorage` ngay. |
| FR-09 | Tải khi khởi động | Refresh trang → danh sách khôi phục đúng. |
| FR-10 | Xử lý lỗi parse | JSON hỏng trong `localStorage` → bắt đầu danh sách rỗng, không crash. |
| FR-11 | `localStorage` không khả dụng | Nếu bị tắt hoặc ghi thất bại → app vẫn chạy trong phiên hiện tại; hiển thị cảnh báo ngắn. |

### 4.4 Tùy chọn (Tầng 2)

| ID | Yêu cầu | Tiêu chí chấp nhận |
|----|---------|-------------------|
| FR-12 | Mô tả | Lưu và hiển thị mô tả tùy chọn. |
| FR-13 | Ngày tạo | Lưu `createdAt`, hiển thị định dạng `dd/mm/yyyy`. |
| FR-14 | Đếm việc chưa làm | Cập nhật số lượng sau mỗi thay đổi. |

### 4.5 Mô hình dữ liệu

**Tầng 1 — Task tối thiểu:**

```json
{
  "id": 1719400000000,
  "title": "Học bài JavaScript",
  "completed": false
}
```

- `id`: số nguyên, tạo bằng `Date.now()` (đủ cho bài lớp).
- `title`: chuỗi, bắt buộc, tối đa 100 ký tự.
- `completed`: boolean, mặc định `false`.

**Tầng 2 — Trường bổ sung (nếu triển khai):**

```json
{
  "description": "",
  "createdAt": "2026-06-26T10:00:00.000Z"
}
```

Danh sách lưu trong `localStorage`, key: `taskmanager_tasks`.

**Trạng thái công việc:** chỉ hai trạng thái — *Chưa làm* (`completed: false`) và *Hoàn thành* (`completed: true`). Không có trạng thái "đang làm".

---

## 5. Yêu cầu phi chức năng

| ID | Hạng mục | Yêu cầu |
|----|----------|---------|
| NFR-01 | **Khả năng sử dụng** | Giao diện tự giải thích; thêm task đầu tiên không cần hướng dẫn dài. |
| NFR-02 | **Hiệu năng** | Phản hồi ngay khi thao tác; mượt với vài chục công việc. |
| NFR-03 | **Tương thích** | Chạy trên Chrome và Edge phiên bản mới. |
| NFR-04 | **Responsive** | Hiển thị ổn từ viewport 360px trở lên. |
| NFR-05 | **Mã nguồn** | Tên biến/hàm có nghĩa; logic tách file rõ ràng (xem mục 7). |
| NFR-06 | **Triển khai** | Mở trực tiếp `index.html` bằng trình duyệt — **không bắt buộc** server hay npm. |

---

## 6. Ngăn xếp công nghệ

| Lớp | Công nghệ | Ghi chú |
|-----|-----------|---------|
| Cấu trúc | **HTML5** | Semantic markup cơ bản. |
| Giao diện | **CSS3** | Một file CSS; Flexbox; không dùng framework. |
| Logic | **JavaScript (ES6+)** | Script thường (`<script src="...">`), **không** dùng ES Modules — để mở file trực tiếp được. |
| Lưu trữ | **`localStorage`** | JSON serialize/deserialize. |

**Không sử dụng:** React, Vue, Angular, Node.js, TypeScript, npm dependencies, bundler.

**Công cụ tùy chọn khi phát triển:** Live Server (VS Code) — không bắt buộc vì app chạy được bằng `file://`.

---

## 7. Cấu trúc tập tin

```
TaskManeger/
├── SPEC.md              # Tài liệu đặc tả (tệp này)
├── index.html           # Trang chính
├── css/
│   └── styles.css       # Toàn bộ style (layout + component)
└── js/
    ├─ app.js            # Logic chính: CRUD, filter, render UI, events
    └─ storage.js         # loadTasks(), saveTasks()
```

### 7.1 Trách nhiệm từng tệp

| Tệp | Trách nhiệm |
|-----|-------------|
| `index.html` | Khung HTML theo mục 3.4; liên kết CSS/JS; không chứa logic nghiệp vụ. |
| `styles.css` | Reset cơ bản (`box-sizing`), biến màu, layout, style component. |
| `storage.js` | Đọc/ghi `localStorage`; xử lý lỗi parse. |
| `app.js` | Khởi tạo app, quản lý mảng tasks, render danh sách, gắn sự kiện, lọc. |

---

## 8. Vibe Coding Workflow

Quy trình **Spec-driven Coding** với **Human-in-the-loop** — mỗi task do AI hỗ trợ triển khai, con người review trước khi chuyển bước.

| Bước         | Nội dung                         | FR liên quan                                      |
| ------------ | ---------------------------------| ------------------------------------------------- |
| —            | Review `SPEC.md`                 | —                                                 |
| —            | Review Project Rules             | —                                                 |
| **Task 1**   | Tạo cấu trúc HTML (`index.html` 
                theo mục 3.4)                     |—                                                  |
| —            | *Human review*                   | Kiểm tra semantic HTML, id/class, modal và layout |
| **Task 2**   | Triển khai CSS styling           | —                                                 |
| —            | *Human review*                   | Kiểm tra giao diện, responsive, hiệu ứng          |
| **Task 3**   | CRUD (Thêm, Sửa, Xóa, Hoàn thành)| FR-01 → FR-06                                     |
| —            | *Human review*                   | Kiểm tra CRUD hoạt động đúng                      |
| **Task 4**   | Tìm kiếm công việc               | FR-07                                             |
| —            | *Human review*                   | Kiểm tra tìm kiếm realtime                        |
| **Task 5**   | Triển khai `localStorage`        | FR-08 → FR-11                                     |
| —            | *Human review*                   | Kiểm tra lưu và khôi phục dữ liệu                 |
| —            | Final review & Refactoring       | FR-01 → FR-11                                     |
| *(Tùy chọn)* | Tính năng Tầng 2                 | FR-12 → FR-14                                     |

---

## 9. Checklist kiểm thử thủ công

| # | Kịch bản | Kết quả mong đợi |
|---|----------|------------------|
| T1 | Mở modal Thêm, nhập tiêu đề rỗng, bấm Thêm | Không thêm task; hiển thị thông báo lỗi |
| T2 | Mở modal Thêm, nhập tiêu đề hợp lệ, bấm Thêm | Task được thêm vào đầu danh sách; modal tự đóng |
| T3 | Mở modal Thêm, nhập tiêu đề và nhấn Enter | Hành vi giống bấm nút Thêm |
| T4 | Bật/tắt checkbox | Trạng thái hoàn thành cập nhật; tiêu đề gạch ngang hoặc bỏ gạch ngang |
| T5 | Mở modal Sửa, đổi tiêu đề và lưu | Tiêu đề được cập nhật; modal tự đóng |
| T6 | Mở modal Sửa, bấm Hủy | Không thay đổi dữ liệu; modal đóng |
| T7 | Mở modal Xóa, bấm Hủy | Task vẫn còn trong danh sách; modal đóng |
| T8 | Mở modal Xóa, bấm Xác nhận | Task bị xóa khỏi danh sách; modal đóng |
| T9 | Nhập từ khóa tìm kiếm | Chỉ hiển thị các task có tiêu đề phù hợp. Nếu không có kết quả thì hiển thị Empty State. |
| T10 | Refresh trang (F5) | Danh sách được khôi phục từ `localStorage` |
| T11 | Xóa hết task | Hiển thị trạng thái rỗng `#empty-state` |
| T12 | Thêm / Xóa / Hoàn thành task | Thống kê Tổng, Chưa làm, Hoàn thành cập nhật chính xác |
---

## 10. Tiêu chí chấm điểm (gợi ý)

| Hạng mục | Trọng số | Ghi chú |
|----------|----------|---------|
| Chức năng Tầng 1 (FR-01 → FR-11) | 50% | Thêm, sửa, xóa, hoàn thành, lọc, localStorage |
| Giao diện & UX | 20% | Gọn, dễ dùng, responsive cơ bản |
| Chất lượng mã | 20% | Tách file, tên rõ, không lỗi console |
| Tầng 2 (tùy chọn) | 10% | Mỗi tính năng thêm +2–3 điểm trong nhóm này |

---

## 11. Tiêu chí hoàn thành (Definition of Done)

**Tầng 1 (bắt buộc):**

- [ ] FR-01 → FR-11 được triển khai.
- [ ] Giao diện khớp mô tả mục 3.1; HTML khớp hợp đồng mục 3.4.
- [ ] Dữ liệu tồn tại sau refresh.
- [ ] Không lỗi JavaScript trên console trong luồng bình thường.
- [ ] Checklist T1 → T12 đều pass.
- [ ] Thống kê luôn phản ánh đúng số lượng task.

**Tầng 2 (nếu làm thêm):**

- [ ] Các FR tùy chọn đã chọn hoạt động đúng.

---
## 12. Roadmap phát triển (Enhancement)

Sau khi hoàn thành MVP, dự án có thể được mở rộng với các tính năng sau:

### Phase 2 – UI & User Experience

| Task | Nội dung |
|------|----------|
| Task 7 | Cải thiện giao diện danh sách công việc (Task Card, Checkbox, Button, Hover, Responsive). |
| Task 8 | Thêm hiệu ứng Animation và Transition cho Task, Button và Modal. |
| Task 9 | Tối ưu Responsive cho Desktop, Tablet và Mobile. |

---

### Phase 3 – Advanced Features (Optional)

| Task | Nội dung |
|------|----------|
| Task 10 | Thêm Deadline cho công việc. |
| Task 11 | Sắp xếp công việc theo nhiều tiêu chí. |
| Task 12 | Thêm mức ưu tiên (Low / Medium / High). |
| Task 13 | Thêm danh mục (Category). |
| Task 14 | Hỗ trợ Dark Mode. |