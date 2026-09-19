export function exportToCSV(records) {
  if (records.length === 0) return false;

  const headers = ["Customer Name","Phone","Bike Model","Oil Product","Last Change Date","Last Change Mileage","Current Mileage","Next Due Mileage","Next Due Date","Status"];
  const rows = records.map(r => [
    r.customerName, r.phone, r.bikeModel, r.oilProduct,
    r.lastChangeDate, r.lastChangeMileage, r.currentMileage,
    r.nextDueMileage, r.nextDueDate, r.status
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `enbull-records-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}

export function printReceipt(record) {
  const receiptWindow = window.open("", "_blank", "width=420,height=600");
  receiptWindow.document.write(`
    <html>
    <head>
      <title>Service Receipt - ${record.customerName}</title>
      <style>
        body { font-family: 'Courier New', monospace; padding: 24px; color: #14171a; }
        h1 { font-size: 18px; border-bottom: 2px dashed #14171a; padding-bottom: 10px; }
        .row { display: flex; justify-content: space-between; margin: 8px 0; font-size: 14px; }
        .label { color: #555; }
        .footer { margin-top: 20px; border-top: 1px dashed #14171a; padding-top: 10px; font-size: 12px; text-align: center; color: #555; }
      </style>
    </head>
    <body>
      <h1>🛢️ Enbull Service Receipt</h1>
      <div class="row"><span class="label">Customer</span><span>${record.customerName}</span></div>
      <div class="row"><span class="label">Phone</span><span>${record.phone}</span></div>
      <div class="row"><span class="label">Bike Model</span><span>${record.bikeModel}</span></div>
      <div class="row"><span class="label">Oil Used</span><span>${record.oilProduct}</span></div>
      <div class="row"><span class="label">Service Date</span><span>${record.lastChangeDate}</span></div>
      <div class="row"><span class="label">Mileage at Service</span><span>${record.lastChangeMileage} km</span></div>
      <div class="row"><span class="label">Next Due Mileage</span><span>${record.nextDueMileage} km</span></div>
      <div class="row"><span class="label">Next Due Date</span><span>${record.nextDueDate}</span></div>
      <div class="footer">Thank you for choosing Enbull Lubricants.</div>
    </body>
    </html>
  `);
  receiptWindow.document.close();
  receiptWindow.focus();
  receiptWindow.print();
}