const STORAGE_KEY = "enbullRecords";

export function loadRecords() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function generateId() {
  return "id-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
}