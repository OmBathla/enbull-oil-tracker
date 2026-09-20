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

function generateInvoiceNumber(record) {
  const datePart = record.lastChangeDate.replace(/-/g, "");
  const idPart = record.id.slice(-4).toUpperCase();
  return `ENB-${datePart}-${idPart}`;
}

const OIL_PRICES = {
  "Enbull Standard": 450,
  "Enbull Synthetic": 850,
  "Enbull Premium": 1200
};

export function printReceipt(record) {
  const invoiceNo = generateInvoiceNumber(record);
  const issuedDate = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const oilPrice = OIL_PRICES[record.oilProduct] || 500;
  const serviceCharge = 150;
  const total = oilPrice + serviceCharge;

  const receiptWindow = window.open("", "_blank", "width=480,height=720");
  receiptWindow.document.write(`
    <html>
    <head>
      <title>Receipt ${invoiceNo}</title>
      <meta charset="UTF-8">
      <style>
        * { box-sizing: border-box; }
        body {
          font-family: 'Courier New', monospace;
          padding: 30px;
          color: #1a1a1a;
          max-width: 420px;
          margin: 0 auto;
        }
        .letterhead {
          text-align: center;
          border-bottom: 3px double #1a1a1a;
          padding-bottom: 14px;
          margin-bottom: 16px;
        }
        .logo-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 6px;
        }
        .logo-row img { width: 34px; height: 34px; border-radius: 6px; }
        .brand-name { font-size: 20px; font-weight: bold; letter-spacing: 1px; }
        .brand-tag { font-size: 11px; color: #555; margin-top: 2px; }
        .meta-row {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          margin: 14px 0;
          color: #444;
        }
        .section-title {
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #ccc;
          padding-bottom: 4px;
          margin: 16px 0 8px 0;
        }
        .row {
          display: flex;
          justify-content: space-between;
          font-size: 13.5px;
          margin: 6px 0;
        }
        .row .label { color: #555; }
        .row .value { font-weight: bold; text-align: right; }
        .charges-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
          font-size: 13px;
        }
        .charges-table td { padding: 6px 0; }
        .charges-table .amt { text-align: right; }
        .total-row {
          border-top: 2px solid #1a1a1a;
          font-weight: bold;
          font-size: 15px;
        }
        .status-tag {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: bold;
          border: 1px solid #1a1a1a;
        }
        .footer {
          margin-top: 24px;
          border-top: 2px dashed #1a1a1a;
          padding-top: 12px;
          text-align: center;
          font-size: 11px;
          color: #555;
        }
        .footer .thanks {
          font-size: 13px;
          font-weight: bold;
          color: #1a1a1a;
          margin-bottom: 4px;
        }
        @media print {
          body { padding: 10px; }
        }
      </style>
    </head>
    <body>

      <div class="letterhead">
        <div class="logo-row">
          <img src="${window.location.origin}/logo.png" onerror="this.style.display='none'">
          <span class="brand-name">ENBULL LUBRICANTS</span>
        </div>
        <div class="brand-tag">Authorized Service Record &amp; Payment Receipt</div>
      </div>

      <div class="meta-row">
        <span>Invoice No: <strong>${invoiceNo}</strong></span>
        <span>Issued: ${issuedDate}</span>
      </div>

      <div class="section-title">Customer Details</div>
      <div class="row"><span class="label">Name</span><span class="value">${record.customerName}</span></div>
      <div class="row"><span class="label">Phone</span><span class="value">${record.phone}</span></div>
      <div class="row"><span class="label">Bike Model</span><span class="value">${record.bikeModel}</span></div>

      <div class="section-title">Service Details</div>
      <div class="row"><span class="label">Oil Product</span><span class="value">${record.oilProduct}</span></div>
      <div class="row"><span class="label">Service Date</span><span class="value">${record.lastChangeDate}</span></div>
      <div class="row"><span class="label">Mileage at Service</span><span class="value">${record.lastChangeMileage} km</span></div>
      <div class="row"><span class="label">Current Mileage</span><span class="value">${record.currentMileage} km</span></div>
      <div class="row"><span class="label">Next Due Mileage</span><span class="value">${record.nextDueMileage} km</span></div>
      <div class="row"><span class="label">Next Due Date</span><span class="value">${record.nextDueDate}</span></div>
      <div class="row"><span class="label">Status</span><span class="value"><span class="status-tag">${record.status}</span></span></div>

      <div class="section-title">Charges</div>
      <table class="charges-table">
        <tr><td>${record.oilProduct}</td><td class="amt">₹${oilPrice}</td></tr>
        <tr><td>Service Charge</td><td class="amt">₹${serviceCharge}</td></tr>
        <tr class="total-row"><td>Total Paid</td><td class="amt">₹${total}</td></tr>
      </table>

      <div class="footer">
        <div class="thanks">Thank you for choosing Enbull Lubricants</div>
        This is a system-generated receipt for record-keeping purposes.<br>
        For queries, contact your nearest Enbull authorized service center.
      </div>

    </body>
    </html>
  `);
  receiptWindow.document.close();
  receiptWindow.focus();
  setTimeout(() => receiptWindow.print(), 300);
}