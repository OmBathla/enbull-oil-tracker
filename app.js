import { SAMPLE_RECORDS } from "./modules/seedData.js";
import { loadRecords, saveRecords, generateId } from "./modules/storage.js";
import { calculateNextDue, getStatus } from "./modules/calculations.js";
import { renderRecords, renderDashboard } from "./modules/render.js";

let records = loadRecords();

const form = document.getElementById("recordForm");
const tbody = document.getElementById("recordsBody");
const searchInput = document.getElementById("searchInput");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const submitBtn = document.getElementById("submitBtn");
const formTitle = document.getElementById("formTitle");

function refreshUI(list = records) {
  // Recalculate status on every render, since "days remaining" changes daily
  list.forEach(r => { r.status = getStatus(r); });
  renderRecords(list, tbody);
  renderDashboard(records);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const id = document.getElementById("recordId").value;

  const record = {
    id: id || generateId(),
    customerName: document.getElementById("customerName").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    bikeModel: document.getElementById("bikeModel").value.trim(),
    currentMileage: Number(document.getElementById("currentMileage").value),
    oilProduct: document.getElementById("oilProduct").value,
    lastChangeDate: document.getElementById("lastChangeDate").value,
    lastChangeMileage: Number(document.getElementById("lastChangeMileage").value)
  };

  const { nextDueMileage, nextDueDate } = calculateNextDue(record);
  record.nextDueMileage = nextDueMileage;
  record.nextDueDate = nextDueDate;
  record.status = getStatus(record);

  if (id) {
    // editing existing record
    const index = records.findIndex(r => r.id === id);
    records[index] = record;
    exitEditMode();
  } else {
    records.push(record);
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
    }
  }

  if (e.target.classList.contains("edit-btn")) {
    const record = records.find(r => r.id === id);
    enterEditMode(record);
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

searchInput.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase();
  const filtered = records.filter(r =>
    r.customerName.toLowerCase().includes(q) || r.phone.includes(q)
  );
  refreshUI(filtered);
});
document.getElementById("loadSampleBtn").addEventListener("click", () => {
  const seeded = SAMPLE_RECORDS.map(r => {
    const { nextDueMileage, nextDueDate } = calculateNextDue(r);
    return { ...r, nextDueMileage, nextDueDate, status: getStatus({ ...r, nextDueMileage, nextDueDate }) };
  });
  records = seeded;
  saveRecords(records);
  refreshUI();
});
refreshUI();