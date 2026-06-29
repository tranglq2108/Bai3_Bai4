// DocumentManager App
// Đảm bảo tuân thủ đầy đủ HTML Contract và logic nghiệp vụ mới.

// Khởi tạo danh sách tài liệu từ localStorage
let documents = loadDocuments();

// ── DOM ELEMENTS ───────────────────────────────────────────────────────────

// Nút mở form thêm tài liệu
const addDocBtn = document.getElementById('add-document-btn');

// Tìm kiếm & Lọc nâng cao
const searchInput = document.getElementById('search-input');
const toggleAdvancedSearchBtn = document.getElementById('toggle-advanced-search');
const advancedSearchFields = document.getElementById('advanced-search-fields');
const filterTypeSelect = document.getElementById('filter-type');
const filterCategorySelect = document.getElementById('filter-category');
const filterDateFromInput = document.getElementById('filter-date-from');
const filterDateToInput = document.getElementById('filter-date-to');

// Thống kê
const statsTotal = document.getElementById('stats-total');
const statsResult = document.getElementById('stats-result');

// Danh sách & Trạng thái trống
const documentList = document.getElementById('document-list');
const emptyState = document.getElementById('empty-state');

// Modal Thêm
const addDocModal = document.getElementById('add-document-modal');
const addDocForm = document.getElementById('add-document-form');
const addTitleInput = document.getElementById('add-title');
const addTypeSelect = document.getElementById('add-type');
const addCategorySelect = document.getElementById('add-category');
const addDateInput = document.getElementById('add-date');
const addContentInput = document.getElementById('add-content');
const cancelAddBtn = addDocForm ? addDocForm.querySelector('button[type="button"]') : null;

// Modal Sửa
const editDocModal = document.getElementById('edit-document-modal');
const editDocForm = document.getElementById('edit-document-form');
const editTitleInput = document.getElementById('edit-title');
const editTypeSelect = document.getElementById('edit-type');
const editCategorySelect = document.getElementById('edit-category');
const editDateInput = document.getElementById('edit-date');
const editContentInput = document.getElementById('edit-content');
const editSuccessMsg = document.getElementById('edit-success-msg');
const cancelEditBtn = editDocForm ? editDocForm.querySelector('button[type="button"]') : null;

// Modal Xem chi tiết
const viewDocModal = document.getElementById('view-document-modal');
const viewTitle = document.getElementById('view-title');
const viewType = document.getElementById('view-type');
const viewCategory = document.getElementById('view-category');
const viewDate = document.getElementById('view-date');
const viewContent = document.getElementById('view-content');
const closeViewBtn = viewDocModal ? viewDocModal.querySelector('.view-actions button') : null;

// Modal Xóa
const deleteDocModal = document.getElementById('delete-document-modal');
const confirmDeleteBtn = deleteDocModal ? deleteDocModal.querySelector('button:first-of-type') : null;
const cancelDeleteBtn = deleteDocModal ? deleteDocModal.querySelector('button:last-of-type') : null;

// ── STATE ──────────────────────────────────────────────────────────────────
let pendingDeleteId = null; // ID văn bản chuẩn bị xóa
let isSubmittingEdit = false; // Ngăn chặn submit liên tục khi đang hiện thông báo sửa thành công

// ── HELPER FUNCTIONS ────────────────────────────────────────────────────────

// Hiển thị modal
function openModal(modal) {
  if (!modal) return;
  modal.removeAttribute('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

// Đóng modal
function closeModal(modal) {
  if (!modal) return;
  modal.setAttribute('hidden', '');
  modal.setAttribute('aria-hidden', 'true');
}

// Định dạng ngày hiển thị (YYYY-MM-DD -> DD/MM/YYYY)
function formatDate(dateStr) {
  if (!dateStr) return 'Chưa rõ';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

// Trích xuất danh sách văn bản đã được lọc dựa trên tìm kiếm thường và nâng cao
function getFilteredDocuments() {
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const filterType = filterTypeSelect ? filterTypeSelect.value : '';
  const filterCategory = filterCategorySelect ? filterCategorySelect.value : '';
  const dateFrom = filterDateFromInput ? filterDateFromInput.value : '';
  const dateTo = filterDateToInput ? filterDateToInput.value : '';

  return documents.filter(doc => {
    // 1. Lọc theo tiêu đề
    if (query && !doc.title.toLowerCase().includes(query)) {
      return false;
    }
    // 2. Lọc theo loại văn bản
    if (filterType && doc.type !== filterType) {
      return false;
    }
    // 3. Lọc theo phân loại
    if (filterCategory && doc.category !== filterCategory) {
      return false;
    }
    // 4. Lọc theo khoảng ngày (từ ngày)
    if (dateFrom && doc.date < dateFrom) {
      return false;
    }
    // 5. Lọc theo khoảng ngày (đến ngày)
    if (dateTo && doc.date > dateTo) {
      return false;
    }
    return true;
  });
}

// Kiểm tra xem có bộ lọc tìm kiếm nào đang kích hoạt hay không
function isFilterActive() {
  const query = searchInput ? searchInput.value.trim() : '';
  const filterType = filterTypeSelect ? filterTypeSelect.value : '';
  const filterCategory = filterCategorySelect ? filterCategorySelect.value : '';
  const dateFrom = filterDateFromInput ? filterDateFromInput.value : '';
  const dateTo = filterDateToInput ? filterDateToInput.value : '';

  return !!(query || filterType || filterCategory || dateFrom || dateTo);
}

// ── RENDER FUNCTIONS ────────────────────────────────────────────────────────

// Cập nhật thống kê
function renderStats() {
  const total = documents.length;
  if (statsTotal) statsTotal.textContent = total;

  if (statsResult) {
    // Nếu có tìm kiếm/bộ lọc hoạt động thì hiển thị số lượng kết quả, ngược lại hiển thị "-"
    statsResult.textContent = isFilterActive() ? getFilteredDocuments().length : '-';
  }
}

// Cập nhật danh sách văn bản hiển thị
function renderDocumentList() {
  if (!documentList) return;

  const filtered = getFilteredDocuments();
  documentList.innerHTML = '';

  if (filtered.length === 0) {
    if (emptyState) emptyState.removeAttribute('hidden');
  } else {
    if (emptyState) emptyState.setAttribute('hidden', '');

    filtered.forEach(doc => {
      const li = document.createElement('li');
      li.dataset.id = doc.id;

      // Tiêu đề văn bản
      const h3 = document.createElement('h3');
      h3.textContent = doc.title;

      // Nhãn metadata (Loại, phân loại, ngày)
      const metaDiv = document.createElement('div');
      metaDiv.className = 'doc-meta';

      const typeTag = document.createElement('span');
      typeTag.className = 'meta-tag type-tag';
      typeTag.textContent = doc.type || 'Chưa rõ';

      const catTag = document.createElement('span');
      catTag.className = 'meta-tag cat-tag';
      catTag.textContent = doc.category || 'Chưa rõ';

      const dateTag = document.createElement('span');
      dateTag.className = 'meta-tag date-tag';
      dateTag.textContent = formatDate(doc.date);

      metaDiv.appendChild(typeTag);
      metaDiv.appendChild(catTag);
      metaDiv.appendChild(dateTag);

      // Nội dung tóm tắt/trích yếu (hiển thị 1-2 dòng bằng CSS)
      const p = document.createElement('p');
      p.textContent = doc.content || 'Không có nội dung trích yếu.';

      // Các nút thao tác
      const actionsDiv = document.createElement('div');

      const viewBtn = document.createElement('button');
      viewBtn.type = 'button';
      viewBtn.textContent = 'Xem';
      viewBtn.addEventListener('click', () => openViewModal(doc.id));

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.textContent = 'Sửa';
      editBtn.addEventListener('click', () => openEditModal(doc.id));

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.textContent = 'Xóa';
      deleteBtn.addEventListener('click', () => openDeleteModal(doc.id));

      actionsDiv.appendChild(viewBtn);
      actionsDiv.appendChild(editBtn);
      actionsDiv.appendChild(deleteBtn);

      // Thêm vào card
      li.appendChild(h3);
      li.appendChild(metaDiv);
      li.appendChild(p);
      li.appendChild(actionsDiv);

      documentList.appendChild(li);
    });
  }
}

// ── MODAL ACTIONS ───────────────────────────────────────────────────────────

// Mở Modal Xem chi tiết
function openViewModal(id) {
  const doc = documents.find(d => d.id === id);
  if (!doc || !viewDocModal) return;

  if (viewTitle) viewTitle.textContent = doc.title;
  if (viewType) viewType.textContent = doc.type;
  if (viewCategory) viewCategory.textContent = doc.category;
  if (viewDate) viewDate.textContent = formatDate(doc.date);
  if (viewContent) {
    viewContent.textContent = doc.content || 'Không có nội dung trích yếu.';
  }

  openModal(viewDocModal);
}

// Mở Modal Sửa
function openEditModal(id) {
  const doc = documents.find(d => d.id === id);
  if (!doc || !editDocModal) return;

  // Điền dữ liệu vào form
  if (editTitleInput) editTitleInput.value = doc.title;
  if (editTypeSelect) editTypeSelect.value = doc.type || '';
  if (editCategorySelect) editCategorySelect.value = doc.category || '';
  if (editDateInput) editDateInput.value = doc.date || '';
  if (editContentInput) editContentInput.value = doc.content || '';

  // Ẩn thông báo thành công
  if (editSuccessMsg) editSuccessMsg.setAttribute('hidden', '');
  isSubmittingEdit = false;

  // Lưu trữ ID cần chỉnh sửa
  editDocForm.dataset.editId = id;

  openModal(editDocModal);
  if (editTitleInput) editTitleInput.focus();
}

// Mở Modal Xóa
function openDeleteModal(id) {
  pendingDeleteId = id;
  if (deleteDocModal) openModal(deleteDocModal);
}

// ── EVENT LISTENERS ─────────────────────────────────────────────────────────

// --- Tìm kiếm nâng cao ---
if (toggleAdvancedSearchBtn && advancedSearchFields) {
  toggleAdvancedSearchBtn.addEventListener('click', () => {
    const isHidden = advancedSearchFields.hasAttribute('hidden');
    if (isHidden) {
      advancedSearchFields.removeAttribute('hidden');
      toggleAdvancedSearchBtn.textContent = 'Thu gọn';
    } else {
      advancedSearchFields.setAttribute('hidden', '');
      toggleAdvancedSearchBtn.textContent = 'Nâng cao';
      
      // Reset bộ lọc nâng cao khi thu gọn (tùy chọn nhưng giúp trải nghiệm nhất quán)
      if (filterTypeSelect) filterTypeSelect.value = '';
      if (filterCategorySelect) filterCategorySelect.value = '';
      if (filterDateFromInput) filterDateFromInput.value = '';
      if (filterDateToInput) filterDateToInput.value = '';
      
      renderDocumentList();
      renderStats();
    }
  });
}

// Kích hoạt tìm kiếm khi thay đổi các bộ lọc
const filterInputs = [
  searchInput,
  filterTypeSelect,
  filterCategorySelect,
  filterDateFromInput,
  filterDateToInput
];

filterInputs.forEach(input => {
  if (input) {
    input.addEventListener('input', () => {
      renderDocumentList();
      renderStats();
    });
    input.addEventListener('change', () => {
      renderDocumentList();
      renderStats();
    });
  }
});

// --- Modal Thêm ---
if (addDocBtn && addDocModal) {
  addDocBtn.addEventListener('click', () => {
    // Reset form và đặt ngày mặc định là hôm nay
    if (addDocForm) {
      addDocForm.reset();
      if (addDateInput) {
        addDateInput.value = new Date().toISOString().split('T')[0];
      }
    }
    openModal(addDocModal);
    if (addTitleInput) addTitleInput.focus();
  });
}

if (cancelAddBtn && addDocModal) {
  cancelAddBtn.addEventListener('click', () => {
    closeModal(addDocModal);
    if (addDocForm) addDocForm.reset();
  });
}

if (addDocForm && addDocModal) {
  addDocForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = addTitleInput.value.trim();
    const type = addTypeSelect.value;
    const category = addCategorySelect.value;
    const date = addDateInput.value;
    const content = addContentInput.value.trim();

    // Validate
    if (!title || !type || !category || !date) {
      alert('Vui lòng nhập đầy đủ các trường bắt buộc (*)!');
      return;
    }

    const newDoc = {
      id: Date.now(),
      title,
      type,
      category,
      date,
      content
    };

    documents.push(newDoc);
    saveDocuments(documents);

    renderDocumentList();
    renderStats();

    closeModal(addDocModal);
    addDocForm.reset();
  });
}

// --- Modal Sửa ---
if (cancelEditBtn && editDocModal) {
  cancelEditBtn.addEventListener('click', () => {
    if (isSubmittingEdit) return; // Ngăn đóng khi đang lưu
    closeModal(editDocModal);
    if (editDocForm) editDocForm.reset();
  });
}

if (editDocForm && editDocModal) {
  editDocForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (isSubmittingEdit) return;

    const title = editTitleInput.value.trim();
    const type = editTypeSelect.value;
    const category = editCategorySelect.value;
    const date = editDateInput.value;
    const content = editContentInput.value.trim();

    // Validate
    if (!title || !type || !category || !date) {
      alert('Vui lòng nhập đầy đủ các trường bắt buộc (*)!');
      return;
    }

    const id = Number(editDocForm.dataset.editId);
    const index = documents.findIndex(d => d.id === id);

    if (index !== -1) {
      documents[index].title = title;
      documents[index].type = type;
      documents[index].category = category;
      documents[index].date = date;
      documents[index].content = content;
      
      saveDocuments(documents);
      
      // Render lại giao diện ngay lập tức
      renderDocumentList();
      renderStats();
      
      // Đánh dấu đang submit và hiển thị thông báo thành công
      isSubmittingEdit = true;
      if (editSuccessMsg) {
        editSuccessMsg.removeAttribute('hidden');
      }

      // Đợi 1 giây rồi tự động đóng modal và dọn dẹp
      setTimeout(() => {
        closeModal(editDocModal);
        if (editDocForm) {
          editDocForm.reset();
          delete editDocForm.dataset.editId;
        }
        if (editSuccessMsg) {
          editSuccessMsg.setAttribute('hidden', '');
        }
        isSubmittingEdit = false;
      }, 1000);
    } else {
      alert('Không tìm thấy tài liệu cần sửa!');
      closeModal(editDocModal);
    }
  });
}

// --- Modal Xem chi tiết ---
if (closeViewBtn && viewDocModal) {
  closeViewBtn.addEventListener('click', () => {
    closeModal(viewDocModal);
  });
}

// Đóng modal xem chi tiết khi click vùng ngoài modal
if (viewDocModal) {
  viewDocModal.addEventListener('click', (e) => {
    if (e.target === viewDocModal) {
      closeModal(viewDocModal);
    }
  });
}

// Đóng modal thêm khi click vùng ngoài modal
if (addDocModal) {
  addDocModal.addEventListener('click', (e) => {
    if (e.target === addDocModal) {
      closeModal(addDocModal);
      if (addDocForm) addDocForm.reset();
    }
  });
}

// Đóng modal sửa khi click vùng ngoài modal
if (editDocModal) {
  editDocModal.addEventListener('click', (e) => {
    if (isSubmittingEdit) return; // Ngăn đóng khi đang lưu
    if (e.target === editDocModal) {
      closeModal(editDocModal);
      if (editDocForm) editDocForm.reset();
    }
  });
}

// --- Modal Xóa ---
if (confirmDeleteBtn && deleteDocModal) {
  confirmDeleteBtn.addEventListener('click', () => {
    if (pendingDeleteId === null) return;

    documents = documents.filter(d => d.id !== pendingDeleteId);
    pendingDeleteId = null;
    saveDocuments(documents);

    renderDocumentList();
    renderStats();

    closeModal(deleteDocModal);
  });
}

if (cancelDeleteBtn && deleteDocModal) {
  cancelDeleteBtn.addEventListener('click', () => {
    pendingDeleteId = null;
    closeModal(deleteDocModal);
  });
}

// Đóng modal xóa khi click vùng ngoài modal
if (deleteDocModal) {
  deleteDocModal.addEventListener('click', (e) => {
    if (e.target === deleteDocModal) {
      pendingDeleteId = null;
      closeModal(deleteDocModal);
    }
  });
}

// ── INITIAL RENDER ───────────────────────────────────────────────────────────
renderDocumentList();
renderStats();
