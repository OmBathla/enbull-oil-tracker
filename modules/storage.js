import { getSession } from "./auth.js";

function getStorageKey() {
  const session = getSession();
  const email = session ? session.email : "guest";
  return `enbullRecords_${email}`;
}

export function loadRecords() {
  const data = localStorage.getItem(getStorageKey());
  return data ? JSON.parse(data) : [];
}

export function saveRecords(records) {
  localStorage.setItem(getStorageKey(), JSON.stringify(records));
}

export function generateId() {
  return "id-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
}