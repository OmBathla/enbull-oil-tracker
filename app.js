import { loadRecords, saveRecords, generateId } from "./modules/storage.js";
import { calculateNextDue, getStatus } from "./modules/calculations.js";
import { renderRecords, renderDashboard, updateSortIndicators } from "./modules/render.js";
import { SAMPLE_RECORDS } from "./modules/seedData.js";
import { showToast } from "./modules/toast.js";
import { exportToCSV, printReceipt } from "./modules/export.js";
import { requireAuth, getSession, logout } from "./modules/auth.js";

requireAuth();
const session = getSession();
document.getElementById("userNameLabel").textContent = session ? session.name : "";

document.getElementById("logoutBtn").addEventListener("click", () => {
  logout();
  window.location.href = "login.html";
});

let records = loadRecords();
let currentFilter = "All";
let currentSort = { key: null, dir: 1 };

const form = document.getElementById("recordForm");
const tbody = document.getElementById("recordsBody");
const searchInput = document.getElementById("searchInput");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const submitBtn = document.getElementById("submitBtn");
const formTitle = document.getElementById("formTitle");

function getVisibleRecords() {
  let list = [...records];

  const q = searchInput.value.toLowerCase().trim();
  if (q) {
    list = list.filter(r =>
      r.customerName.toLowerCase().includes(q) || r.phone.includes(q)
    );
  }

  if (currentFilter !== "All") {
    list = list.filter(r => r.status === currentFilter);
  }

  if (currentSort.key) {
    list.sort((a, b) => {
      let av = a[currentSort.key];
      let bv = b[currentSort.key];
      if (typeof av === "string") { av = av.toLowerCase(); bv = bv.toLowerCase(); }
      if (av < bv) return -1 * currentSort.dir;
      if (av > bv) return 1 * currentSort.dir;
      return 0;
    });
  }

  return list;
}

function refreshUI() {
  records.forEach(r => { r.status = getStatus(r); });
  renderRecords(getVisibleRecords(), tbody);
  renderDashboard(records);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const id = document.getElementById("recordId").value;
  const currentMileage = Number(document.getElementById("currentMileage").value);
  const lastChangeMileage = Number(document.getElementById("lastChangeMileage").value);

  if (currentMileage < lastChangeMileage) {
    showToast("Current mileage can't be less than the mileage at oil change.", "error");
    return;
  }

  const record = {
    id: id || generateId(),
    customerName: document.getElementById("customerName").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    bikeModel: document.getElementById("bikeModel").value.trim(),
    currentMileage,
    oilProduct: document.getElementById("oilProduct").value,
    lastChangeDate: document.getElementById("lastChangeDate").value,
    lastChangeMileage
  };

  const { nextDueMileage, nextDueDate } = calculateNextDue(record);
  record.nextDueMileage = nextDueMileage;
  record.nextDueDate = nextDueDate;
  record.status = getStatus(record);

  if (id) {
    const index = records.findIndex(r => r.id === id);
    records[index] = record;
    exitEditMode();
    showToast("Record updated.", "success");
  } else {
    records.push(record);
    showToast("Record added.", "success");
  }

  saveRecords(records);
  form.reset();
  refreshUI();
});

tbody.addEventListener("click", (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.classList.contains("delete-btn")) {
    if (confirm("Delete this record?")) {
      records = records.filter(r => r.id !== id);
      saveRecords(records);
      refreshUI();
      showToast("Record deleted.", "success");
    }
  }

  if (e.target.classList.contains("edit-btn")) {
    const record = records.find(r => r.id === id);
    enterEditMode(record);
  }

  if (e.target.classList.contains("print-btn")) {
    const record = records.find(r => r.id === id);
    printReceipt(record);
  }
});

function enterEditMode(record) {
  document.getElementById("recordId").value = record.id;
  document.getElementById("customerName").value = record.customerName;
  document.getElementById("phone").value = record.phone;
  document.getElementById("bikeModel").value = record.bikeModel;
  document.getElementById("currentMileage").value = record.currentMileage;
  document.getElementById("oilProduct").value = record.oilProduct;
  document.getElementById("lastChangeDate").value = record.lastChangeDate;
  document.getElementById("lastChangeMileage").value = record.lastChangeMileage;

  formTitle.textContent = "Edit Record";
  submitBtn.textContent = "Save Changes";
  cancelEditBtn.style.display = "inline-block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function exitEditMode() {
  document.getElementById("recordId").value = "";
  formTitle.textContent = "Add Customer & Oil Change Record";
  submitBtn.textContent = "Add Record";
  cancelEditBtn.style.display = "none";
}

cancelEditBtn.addEventListener("click", () => {
  form.reset();
  exitEditMode();
});

searchInput.addEventListener("input", refreshUI);

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    refreshUI();
  });
});

document.querySelectorAll("th[data-key]").forEach(th => {
  th.addEventListener("click", () => {
    const key = th.dataset.key;
    if (currentSort.key === key) {
      currentSort.dir *= -1;
    } else {
      currentSort.key = key;
      currentSort.dir = 1;
    }
    updateSortIndicators(currentSort.key, currentSort.dir);
    refreshUI();
  });
});

document.getElementById("exportCsvBtn").addEventListener("click", () => {
  const visible = getVisibleRecords();
  const success = exportToCSV(visible.length ? visible : records);
  showToast(success ? "CSV exported." : "No records to export.", success ? "success" : "error");
});

document.getElementById("loadSampleBtn").addEventListener("click", () => {
  const seeded = SAMPLE_RECORDS.map(r => {
    const { nextDueMileage, nextDueDate } = calculateNextDue(r);
    return { ...r, nextDueMileage, nextDueDate, status: getStatus({ ...r, nextDueMileage, nextDueDate }) };
  });
  records = seeded;
  saveRecords(records);
  refreshUI();
  showToast("Sample data loaded.", "success");
});

refreshUI();