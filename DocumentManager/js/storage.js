// DocumentManager – Storage Module
// Chịu trách nhiệm duy nhất: đọc/ghi dữ liệu tài liệu với localStorage.

const STORAGE_KEY = 'documentmanager_documents';

/**
 * Tải danh sách tài liệu từ localStorage.
 *
 * @returns {Array<{id: number, title: string, content: string}>}
 *   Mảng tài liệu đã lưu, hoặc mảng rỗng nếu:
 *   - Chưa có dữ liệu trong localStorage.
 *   - Dữ liệu lưu trữ không phải mảng hợp lệ.
 *   - Xảy ra lỗi parse JSON hoặc lỗi đọc localStorage.
 *   Hàm không bao giờ throw lỗi.
 */
function loadDocuments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Ghi toàn bộ mảng tài liệu xuống localStorage.
 *
 * Nếu không thể ghi (ví dụ: QuotaExceededError hoặc localStorage bị khoá),
 * lỗi sẽ được ghi vào console và ứng dụng tiếp tục hoạt động bình thường.
 *
 * @param {Array<{id: number, title: string, content: string}>} documents
 *   Mảng tài liệu cần lưu.
 * @returns {void}
 */
function saveDocuments(documents) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  } catch (error) {
    console.error('[DocumentManager] Không thể lưu dữ liệu vào localStorage:', error);
  }
}
