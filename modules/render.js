export function renderRecords(records, tbodyEl) {
  tbodyEl.innerHTML = "";

  if (records.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td colspan="9">
        <div class="empty-box">
          <div class="empty-icon">🛠️</div>
          <p class="empty-title">No service records yet</p>
          <p class="empty-sub">Add a customer above, or load sample data to see it in action.</p>
        </div>
      </td>`;
    tbodyEl.appendChild(tr);
    return;
  }

  records.forEach(record => {
    const tr = document.createElement("tr");
    const statusClass = record.status.replace(" ", "-");

    tr.innerHTML = `
      <td>${record.customerName}</td>
      <td>${record.phone}</td>
      <td>${record.bikeModel}</td>
      <td>${record.oilProduct}</td>
      <td>${record.lastChangeDate} (${record.lastChangeMileage}km)</td>
      <td>${record.nextDueMileage}</td>
      <td>${record.nextDueDate}</td>
      <td><span class="badge ${statusClass}">${record.status}</span></td>
      <td>
        <button class="action-btn edit-btn" data-id="${record.id}">Edit</button>
        <button class="action-btn print-btn" data-id="${record.id}">Receipt</button>
        <button class="action-btn delete-btn" data-id="${record.id}">Delete</button>
      </td>
    `;
    tbodyEl.appendChild(tr);
  });
}

export function renderDashboard(records) {
  document.getElementById("totalCustomers").textContent = records.length;
  document.getElementById("dueSoonCount").textContent =
    records.filter(r => r.status === "Due Soon").length;
  document.getElementById("overdueCount").textContent =
    records.filter(r => r.status === "Overdue").length;
}

export function updateSortIndicators(activeKey, dir) {
  document.querySelectorAll("th[data-key]").forEach(th => {
    const indicator = th.querySelector(".sort-indicator");
    if (!indicator) return;
    indicator.textContent = th.dataset.key === activeKey ? (dir === 1 ? "▲" : "▼") : "";
  });
}