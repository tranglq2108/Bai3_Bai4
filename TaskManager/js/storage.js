(function () {
  const STORAGE_KEY = 'taskmanager_tasks';
  const storageAvailable = canUseLocalStorage();

  function canUseLocalStorage() {
    try {
      const testKey = '__tm_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  window.isLocalStorageAvailable = storageAvailable;

  window.loadTasks = function () {
    if (!storageAvailable) return [];

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  window.saveTasks = function (tasks) {
    if (!storageAvailable) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // ignore write errors
    }
  };
})();
