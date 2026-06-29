(() => {
  const MAX_TITLE_LENGTH = 100;
  // Form and list elements.
  const searchInput = document.getElementById('search-input');
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskList = document.getElementById('task-list');
  const emptyState = document.getElementById('empty-state');
  const statsTotal = document.getElementById('stats-total');
  const statsActive = document.getElementById('stats-active');
  const statsCompleted = document.getElementById('stats-completed');

  // Modal elements (per SPEC)
  const addModal = document.getElementById('add-task-modal');
  const addInput = document.getElementById('add-task-input');
  const addSave = document.getElementById('add-task-save');
  const addCancel = document.getElementById('add-task-cancel');
  const formError = document.getElementById('form-error');

  const editModal = document.getElementById('edit-task-modal');
  const editInput = document.getElementById('edit-task-input');
  const editSave = document.getElementById('edit-task-save');
  const editCancel = document.getElementById('edit-task-cancel');
  const editFormError = document.getElementById('edit-form-error');

  const deleteModal = document.getElementById('delete-task-modal');
  const deleteMessage = document.getElementById('delete-task-message');
  const deleteConfirm = document.getElementById('delete-task-confirm');
  const deleteCancel = document.getElementById('delete-task-cancel');
  const storageWarningText = 'LocalStorage không khả dụng, dữ liệu chỉ lưu trong phiên hiện tại.';

  // storage.js provides `loadTasks()` and `saveTasks(tasks)` globals

  const appState = {
    tasks: loadTasks(),
    searchQuery: '',
    editTaskId: null,
    deletingTaskId: null,
  };

  if (window.isLocalStorageAvailable === false) {
    const storageWarning = document.createElement('p');
    storageWarning.className = 'add-task__error';
    storageWarning.setAttribute('role', 'status');
    storageWarning.textContent = storageWarningText;

    const main = document.querySelector('.main');
    if (main) {
      main.insertBefore(storageWarning, searchInput ? searchInput.closest('.search-task') : null);
    }
  }

  function getTaskById(taskId) {
    return appState.tasks.find((task) => task.id === taskId);
  }

  function showMessage(message) {
    if (formError) {
      formError.textContent = message;
      formError.hidden = !message;
    }
  }

  function clearMessage() {
    showMessage('');
  }

  function validateTitle(title) {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      return { ok: false, message: 'Tiêu đề không được để trống.' };
    }

    if (normalizedTitle.length > MAX_TITLE_LENGTH) {
      return { ok: false, message: 'Tiêu đề không được vượt quá 100 ký tự.' };
    }

    return { ok: true, value: normalizedTitle };
  }

  function showEmptyState(displayedTasks = appState.tasks) {
    emptyState.hidden = displayedTasks.length > 0;
  }

  function getVisibleTasks() {
    const q = appState.searchQuery;
    if (!q) return appState.tasks.slice();
    return appState.tasks.filter((task) => task.title.toLowerCase().includes(q));
  }

  function updateStatistics() {
    const totalTasks = appState.tasks.length;
    const completedTasks = appState.tasks.filter((task) => task.completed).length;
    const activeTasks = totalTasks - completedTasks;

    statsTotal.textContent = String(totalTasks);
    statsActive.textContent = String(activeTasks);
    statsCompleted.textContent = String(completedTasks);
  }

  function createActionButton(className, label) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `task-item__btn ${className}`;
    button.textContent = label;
    return button;
  }

  function createTaskElement(task) {
    const taskItem = document.createElement('li');
    taskItem.className = `task-item${task.completed ? ' task-item--completed' : ''}`;
    taskItem.dataset.id = String(task.id);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-item__checkbox';
    checkbox.id = `task-${task.id}`;
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', `Đánh dấu hoàn thành: ${task.title}`);

    const title = document.createElement('label');
    title.className = 'task-item__title';
    title.htmlFor = checkbox.id;
    title.textContent = task.title;

    const actions = document.createElement('div');
    actions.className = 'task-item__actions';

    const editButton = createActionButton('task-item__btn--edit', 'Sửa');
    const deleteButton = createActionButton('task-item__btn--delete', 'Xóa');

    actions.append(editButton, deleteButton);

    taskItem.append(checkbox, title, actions);
    return taskItem;
  }

  function renderTasks() {
    taskList.innerHTML = '';
    const visibleTasks = getVisibleTasks();

    if (visibleTasks.length === 0) {
      showEmptyState(visibleTasks);
    } else {
      const fragment = document.createDocumentFragment();
      visibleTasks.forEach((task) => {
        fragment.append(createTaskElement(task));
      });

      taskList.append(fragment);
      showEmptyState(visibleTasks);
    }

    updateStatistics();
  }

  function addTask(title) {
    const validationResult = validateTitle(title);
    if (!validationResult.ok) {
      showMessage(validationResult.message);
      return;
    }

    const normalizedTitle = validationResult.value;

    appState.tasks.unshift({
      id: Date.now(),
      title: normalizedTitle,
      completed: false,
    });

    clearMessage();
    saveTasks(appState.tasks);
    hideModal(addModal);
    if (addInput) addInput.value = '';
    renderTasks();
  }

  function toggleTaskCompletion(taskId, completed) {
    const task = getTaskById(taskId);

    if (!task) {
      return;
    }

    task.completed = completed;
    saveTasks(appState.tasks);
    renderTasks();
  }

  function openEditModal(taskId) {
    const task = getTaskById(taskId);
    if (!task) return;
    appState.editTaskId = taskId;
    if (editInput) editInput.value = task.title;
    if (editFormError) editFormError.hidden = true;
    showModal(editModal);
    if (editInput) editInput.focus();
  }

  function confirmEditTask() {
    const taskId = appState.editTaskId;
    if (typeof taskId !== 'number') return;
    const validationResult = validateTitle(editInput ? editInput.value : '');
    if (!validationResult.ok) {
      if (editFormError) {
        editFormError.textContent = validationResult.message;
        editFormError.hidden = false;
      }
      return;
    }

    const newTitle = validationResult.value;

    const task = getTaskById(taskId);
    if (!task) return;
    task.title = newTitle;
    appState.editTaskId = null;
    if (editFormError) editFormError.hidden = true;
    saveTasks(appState.tasks);
    hideModal(editModal);
    renderTasks();
  }

  function openDeleteModal(taskId) {
    const task = getTaskById(taskId);
    if (!task) return;
    appState.deletingTaskId = taskId;
    if (deleteMessage) deleteMessage.textContent = `Xóa công việc "${task.title}"?`;
    showModal(deleteModal);
    if (deleteConfirm) deleteConfirm.focus();
  }

  function confirmDeleteTask() {
    const id = appState.deletingTaskId;
    if (typeof id !== 'number') return;
    appState.tasks = appState.tasks.filter((t) => t.id !== id);
    appState.deletingTaskId = null;
    saveTasks(appState.tasks);
    hideModal(deleteModal);
    renderTasks();
  }

  // Add modal open
  if (addTaskBtn) {
    addTaskBtn.addEventListener('click', () => {
      if (formError) formError.hidden = true;
      if (addInput) addInput.value = '';
      showModal(addModal);
      if (addInput) addInput.focus();
    });
  }

  // Add modal actions
  if (addSave) {
    addSave.addEventListener('click', () => {
      const value = addInput ? addInput.value : '';
      addTask(value);
    });
  }

  if (addCancel) {
    addCancel.addEventListener('click', () => {
      if (formError) formError.hidden = true;
      hideModal(addModal);
    });
  }

  searchInput.addEventListener('input', (event) => {
    appState.searchQuery = event.target.value.trim().toLowerCase();
    renderTasks();
  });

  taskList.addEventListener('change', (event) => {
    const target = event.target;

    if (!target.classList.contains('task-item__checkbox')) {
      return;
    }

    const taskItem = target.closest('.task-item');
    if (!taskItem) {
      return;
    }

    toggleTaskCompletion(Number(taskItem.dataset.id), target.checked);
  });

  taskList.addEventListener('click', (event) => {
    const target = event.target;
    const taskItem = target.closest('.task-item');

    if (!taskItem) {
      return;
    }

    const taskId = Number(taskItem.dataset.id);
    if (target.classList.contains('task-item__btn--edit')) {
      openEditModal(taskId);
      return;
    }

    if (target.classList.contains('task-item__btn--delete')) {
      openDeleteModal(taskId);
      return;
    }
  });

  // Edit modal actions
  if (editSave) editSave.addEventListener('click', confirmEditTask);
  if (editCancel) editCancel.addEventListener('click', () => {
    appState.editTaskId = null;
    if (editFormError) editFormError.hidden = true;
    hideModal(editModal);
  });

  // Delete modal actions
  if (deleteConfirm) deleteConfirm.addEventListener('click', confirmDeleteTask);
  if (deleteCancel) deleteCancel.addEventListener('click', () => {
    appState.deletingTaskId = null;
    hideModal(deleteModal);
  });

  renderTasks();

  // Small helpers to show/hide modals
  function showModal(modal) {
    if (!modal) return;
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
  }

  function hideModal(modal) {
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
  }
})();
