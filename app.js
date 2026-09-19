const STORE = 'enbullOilTrackerRecords';
const USER_STORE = 'enbullOilTrackerUser';
const products = [
  { name: 'Enbull Standard', intervalKm: 3000, months: 3, best: 'Daily city commuting', description: 'Reliable mineral engine oil for regular motorcycle maintenance.' },
  { name: 'Enbull Synthetic', intervalKm: 5000, months: 6, best: 'Highway and mixed riding', description: 'Synthetic-blend protection for smoother performance over longer rides.' },
  { name: 'Enbull Premium', intervalKm: 7000, months: 8, best: 'Frequent riders', description: 'Long-life premium oil formulated for consistent engine protection.' },
  { name: 'Enbull Max Protect', intervalKm: 6000, months: 6, best: 'Heavy-use motorcycles', description: 'Extra engine protection designed for demanding daily use.' }
];

let page = 'dashboard';
let filter = 'all';
let editingId = null;
const app = document.querySelector('#app');

const loadRecords = () => JSON.parse(localStorage.getItem(STORE) || '[]');
const saveRecords = records => localStorage.setItem(STORE, JSON.stringify(records));
const dateValue = date => new Date(date + 'T00:00:00');
const formatDate = date => date ? dateValue(date).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—';
const inputDate = d => d.toISOString().slice(0, 10);
const addMonths = (date, months) => { const d = dateValue(date); d.setMonth(d.getMonth() + months); return inputDate(d); };
const productByName = name => products.find(p => p.name === name) || products[0];

function status(record) {
  const today = new Date(); today.setHours(0,0,0,0);
  const dueDate = dateValue(record.nextDueDate);
  const mileageLeft = Number(record.nextDueMileage) - Number(record.currentMileage);
  const daysLeft = Math.ceil((dueDate - today) / 86400000);
  if (mileageLeft <= 0 || daysLeft < 0) return 'overdue';
  if (mileageLeft <= 500 || daysLeft <= 21) return 'soon';
  return 'safe';
}
function prettyStatus(s) { return s === 'soon' ? 'Due Soon' : s[0].toUpperCase() + s.slice(1); }
function escapeHtml(value='') { return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c])); }
function toast(message) { const t = document.querySelector('#toast'); t.textContent = message; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2600); }

function seedRecords() {
  if (loadRecords().length) { toast('Records already exist.'); return; }
  const today = new Date();
  const seed = [
    ['Aarav Mehta','9876543210','Honda Activa 6G',125,'Enbull Standard',-35,2100],
    ['Priya Nair','9822011144','TVS Raider 125',125,'Enbull Synthetic',-150,5100],
    ['Rohan Singh','9934512200','Bajaj Pulsar 150',150,'Enbull Premium',-270,7100],
    ['Neha Patel','9988776655','Hero Splendor Plus',100,'Enbull Standard',-115,2850],
    ['Kabir Shah','9877012345','Royal Enfield Classic 350',350,'Enbull Max Protect',-205,6400]
  ].map(([customer,phone,bike,cc,oil,daysAgo,mileage]) => {
    const p = productByName(oil); const d = new Date(today); d.setDate(today.getDate()+daysAgo);
    const lastDate = inputDate(d); const currentMileage = mileage + (oil === 'Enbull Premium' ? 7400 : oil === 'Enbull Synthetic' ? 4600 : 2600);
    return { id: crypto.randomUUID(), customer, phone, bike, cc, currentMileage, oil, lastDate, changeMileage:mileage, notes:'Sample service record', nextDueMileage:mileage+p.intervalKm, nextDueDate:addMonths(lastDate,p.months) };
  });
  saveRecords(seed); toast('Sample data loaded.'); render();
}

function layout(content) {
  const nav = [['dashboard','Dashboard'],['add','Add Record'],['records','Service Records'],['products','Products'],['profile','Profile'],['about','About']]
    .map(([id,label]) => `<button class="${page===id?'active':''}" data-page="${id}">${label}</button>`).join('');
  return `<div class="app-shell"><header class="header"><div class="brand"><div class="brand-mark">🛢️</div><div><h1>Enbull</h1><p>Oil Change Tracker</p></div></div><nav class="nav">${nav}<button class="logout" data-action="logout">Logout</button></nav></header>${content}</div>`;
}
function dashboard() {
  const records = loadRecords(), counts = {safe:0,soon:0,overdue:0}; records.forEach(r => counts[status(r)]++);
  const recent = [...records].sort((a,b)=>b.lastDate.localeCompare(a.lastDate)).slice(0,5);
  return `<section class="page"><div class="page-head"><div><h2 class="page-title">Dashboard</h2><p class="page-subtitle">Keep every motorcycle on schedule.</p></div><div><button class="secondary" data-action="seed">Load sample data</button> <button class="primary" data-page="add">+ Add Record</button></div></div><div class="stats"><div class="card stat"><h3>Total Customers</h3><strong>${records.length}</strong><span class="stat-icon">📋</span></div><div class="card stat soon"><h3>Due Soon</h3><strong>${counts.soon}</strong><span class="stat-icon">⏳</span></div><div class="card stat overdue"><h3>Overdue</h3><strong>${counts.overdue}</strong><span class="stat-icon">⚠️</span></div></div><div class="card"><h2 class="section-title">Recent Records</h2>${recent.length ? recent.map(r=>`<div class="recent-row"><strong>${escapeHtml(r.customer)}</strong><span>${escapeHtml(r.bike)} · ${escapeHtml(r.oil)}</span><b class="badge ${status(r)}">${prettyStatus(status(r))}</b></div>`).join('') : `<div class="empty"><span class="big">🛠️</span><strong>No service records yet</strong><p>Add a record or load sample data to see it here.</p></div>`}</div></section>`;
}
function addPage() {
  const r = editingId ? loadRecords().find(x=>x.id===editingId) : {}; const selected = r.oil || '';
  return `<section class="page"><div class="page-head"><div><h2 class="page-title">${editingId?'Edit':'Add'} Oil Change Record</h2><p class="page-subtitle">Record a motorcycle service and calculate the next due date.</p></div></div><form id="record-form" class="card"><div class="form-grid"><div class="field"><label>Customer Name</label><input required name="customer" value="${escapeHtml(r.customer)}" placeholder="e.g. Rahul Kumar"></div><div class="field"><label>Phone Number</label><input required name="phone" value="${escapeHtml(r.phone)}" placeholder="e.g. 9876543210"></div><div class="field"><label>Bike Model</label><input required name="bike" value="${escapeHtml(r.bike)}" placeholder="e.g. Honda Shine 125"></div><div class="field"><label>Engine Capacity (cc)</label><input required name="cc" type="number" min="1" value="${r.cc||''}" placeholder="e.g. 125"></div><div class="field"><label>Current Mileage (km)</label><input required name="currentMileage" type="number" min="0" value="${r.currentMileage||''}"></div><div class="field"><label>Enbull Oil Product</label><select required name="oil"><option value="">-- Select --</option>${products.map(p=>`<option ${selected===p.name?'selected':''}>${p.name}</option>`).join('')}</select></div><div class="field"><label>Oil Change Date</label><input required name="lastDate" type="date" value="${r.lastDate||inputDate(new Date())}"></div><div class="field"><label>Mileage at Oil Change (km)</label><input required name="changeMileage" type="number" min="0" value="${r.changeMileage||''}"></div><div class="field full"><label>Notes <small>(optional)</small></label><textarea name="notes" placeholder="Any service notes...">${escapeHtml(r.notes)}</textarea></div></div><div class="form-actions"><button class="primary" type="submit">${editingId?'Save Changes':'Add Record'}</button><button class="secondary" type="button" data-page="records">Cancel</button></div></form></section>`;
}
function recordsPage() {
  const records = loadRecords();
  return `<section class="page"><div class="page-head"><div><h2 class="page-title">Service Records</h2><p class="page-subtitle">Find, review, and update motorcycle oil-change records.</p></div><button class="primary" data-page="add">+ Add Record</button></div><div class="card"><div class="table-tools"><input id="search" class="search" placeholder="Search by name, phone, or bike..." value=""><div class="filters">${[['all','All'],['safe','Safe'],['soon','Due Soon'],['overdue','Overdue']].map(([id,label])=>`<button class="filter ${filter===id?'active':''}" data-filter="${id}">${label}</button>`).join('')}<button class="secondary" data-action="export">Export CSV</button></div></div><div class="table-wrap" id="records-table-wrap">${recordsTable(records)}</div></div></section>`;
}
function recordsTable(records, query='') {
  const q = query.toLowerCase(); const visible = records.filter(r => (filter==='all'||status(r)===filter) && `${r.customer} ${r.phone} ${r.bike}`.toLowerCase().includes(q));
  if (!visible.length) return `<div class="empty"><span class="big">🛠️</span><strong>No matching service records</strong><p>Try another search or add a customer record.</p></div>`;
  return `<table class="records-table"><thead><tr><th>Customer</th><th>Phone</th><th>Bike</th><th>Oil Product</th><th>Last Change</th><th>Next Due (km)</th><th>Next Due (date)</th><th>Status</th><th>Actions</th></tr></thead><tbody>${visible.map(r=>`<tr><td>${escapeHtml(r.customer)}</td><td>${escapeHtml(r.phone)}</td><td>${escapeHtml(r.bike)}</td><td>${escapeHtml(r.oil)}</td><td>${formatDate(r.lastDate)}</td><td>${Number(r.nextDueMileage).toLocaleString('en-IN')}</td><td>${formatDate(r.nextDueDate)}</td><td><b class="badge ${status(r)}">${prettyStatus(status(r))}</b></td><td><div class="actions"><button class="icon-button" title="View" data-view="${r.id}">View</button><button class="icon-button" title="Edit" data-edit="${r.id}">Edit</button><button class="icon-button delete" title="Delete" data-delete="${r.id}">Delete</button></div></td></tr>`).join('')}</tbody></table>`;
}
function productsPage() { return `<section class="page"><h2 class="page-title">Enbull Products</h2><p class="page-subtitle">Choose the right lubricant for every motorcycle service.</p><div class="products">${products.map(p=>`<article class="card product"><span class="product-grade">Motorcycle Engine Oil</span><h3>${p.name}</h3><p>${p.description}</p><div class="product-meta"><span class="pill">${p.intervalKm.toLocaleString('en-IN')} km</span><span class="pill">${p.months} months</span><span class="pill">Best for: ${p.best}</span></div></article>`).join('')}</div></section>`; }
function profilePage() { const u = JSON.parse(localStorage.getItem(USER_STORE)||'{"name":"Rahul Sharma","shop":"Enbull Authorized Service Centre","phone":"+91 98765 43210","email":"mechanic@enbull.com"}'); return `<section class="page"><h2 class="page-title">Profile</h2><p class="page-subtitle">Manage your service-centre details.</p><div class="profile-grid"><div class="card profile-summary"><div class="avatar">${u.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</div><h2 class="section-title">${escapeHtml(u.name)}</h2><p>Service Mechanic</p><p>${escapeHtml(u.shop)}</p></div><form id="profile-form" class="card"><h2 class="section-title">Profile Details</h2><div class="form-grid"><div class="field"><label>Name</label><input name="name" required value="${escapeHtml(u.name)}"></div><div class="field"><label>Shop Name</label><input name="shop" required value="${escapeHtml(u.shop)}"></div><div class="field"><label>Phone</label><input name="phone" required value="${escapeHtml(u.phone)}"></div><div class="field"><label>Email</label><input name="email" type="email" required value="${escapeHtml(u.email)}"></div></div><div class="form-actions"><button class="primary">Save Profile</button></div></form></div></section>`; }
function aboutPage() { return `<section class="page about"><div class="card"><h2 class="page-title">Enbull Oil Change Tracker</h2><p class="page-subtitle">A simple digital service-record system for motorcycle lubricants.</p><h3>Problem</h3><p>Motorcycle owners often forget their oil-change schedule, which can affect engine health and lead to missed repeat purchases.</p><h3>Solution</h3><p>This system lets a service centre record each oil change, automatically calculate its next due date and mileage, and quickly identify customers whose services are due.</p><h3>Benefits to Enbull Lubricants</h3><ul><li>Improves customer service and retention.</li><li>Encourages timely, repeat engine-oil purchases.</li><li>Makes service records simple to search and export.</li></ul><h3>Technology Used</h3><p>HTML, CSS, JavaScript, and browser localStorage.</p></div></section>`; }
function login() { return `<section class="login-page"><form id="login-form" class="card login-card"><div class="brand"><div class="brand-mark">🛢️</div><div><h1>Enbull</h1><p>Oil Change Tracker</p></div></div><h2>Welcome back</h2><p>Manage motorcycle oil-change records easily.</p><div class="field"><label>Email</label><input name="email" type="email" required placeholder="mechanic@enbull.com"></div><div class="field" style="margin-top:16px"><label>Password</label><input name="password" type="password" required placeholder="••••••"></div><button class="primary" style="width:100%;margin-top:22px">Login</button><p class="hint">Demo: mechanic@enbull.com &nbsp;|&nbsp; Password: 123456</p></form></section>`; }
function modal(record) { return `<div class="modal-backdrop" id="modal"><section class="modal"><div class="modal-head"><h2>Service Record</h2><button class="icon-button" data-close>✕</button></div><div class="detail-grid">${[['Customer',record.customer],['Phone',record.phone],['Motorcycle',record.bike],['Engine Capacity',`${record.cc} cc`],['Oil Product',record.oil],['Current Mileage',`${Number(record.currentMileage).toLocaleString('en-IN')} km`],['Last Oil Change',formatDate(record.lastDate)],['Next Due Date',formatDate(record.nextDueDate)],['Next Due Mileage',`${Number(record.nextDueMileage).toLocaleString('en-IN')} km`],['Status',prettyStatus(status(record))],['Notes',record.notes||'—']].map(([label,value])=>`<div class="detail"><span>${label}</span><strong>${escapeHtml(value)}</strong></div>`).join('')}</div></section></div>`; }
function render() { if (!localStorage.getItem('enbullLoggedIn')) { app.innerHTML=login(); bind(); return; } let content = page==='dashboard'?dashboard():page==='add'?addPage():page==='records'?recordsPage():page==='products'?productsPage():page==='profile'?profilePage():aboutPage(); app.innerHTML=layout(content); bind(); }
function bind() {
  document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>{ page=b.dataset.page; editingId=null; render(); });
  document.querySelector('[data-action="logout"]')?.addEventListener('click',()=>{ localStorage.removeItem('enbullLoggedIn'); page='dashboard'; render(); });
  document.querySelector('[data-action="seed"]')?.addEventListener('click',seedRecords);
  document.querySelector('#login-form')?.addEventListener('submit',e=>{ e.preventDefault(); const d=Object.fromEntries(new FormData(e.target)); if(d.email==='mechanic@enbull.com'&&d.password==='123456'){localStorage.setItem('enbullLoggedIn','true'); render();}else toast('Use the demo email and password shown below.'); });
  document.querySelector('#record-form')?.addEventListener('submit',e=>{ e.preventDefault(); const data=Object.fromEntries(new FormData(e.target)); const p=productByName(data.oil); const entry={...data,cc:+data.cc,currentMileage:+data.currentMileage,changeMileage:+data.changeMileage,nextDueMileage:+data.changeMileage+p.intervalKm,nextDueDate:addMonths(data.lastDate,p.months)}; let all=loadRecords(); if(editingId){all=all.map(x=>x.id===editingId?{...entry,id:editingId}:x);toast('Record updated.');}else{entry.id=crypto.randomUUID();all.unshift(entry);toast('Oil-change record added.');} saveRecords(all); editingId=null;page='records';render(); });
  document.querySelector('#profile-form')?.addEventListener('submit',e=>{e.preventDefault();localStorage.setItem(USER_STORE,JSON.stringify(Object.fromEntries(new FormData(e.target))));toast('Profile saved.');render();});
  document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;render();});
  document.querySelector('#search')?.addEventListener('input',e=>document.querySelector('#records-table-wrap').innerHTML=recordsTable(loadRecords(),e.target.value));
  document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{document.body.insertAdjacentHTML('beforeend',modal(loadRecords().find(r=>r.id===b.dataset.view)));document.querySelector('[data-close]').onclick=()=>document.querySelector('#modal').remove();});
  document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{editingId=b.dataset.edit;page='add';render();});
  document.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>{if(confirm('Delete this service record?')){saveRecords(loadRecords().filter(r=>r.id!==b.dataset.delete));toast('Record deleted.');render();}});
  document.querySelector('[data-action="export"]')?.addEventListener('click',exportCsv);
}
function exportCsv(){ const rows=loadRecords(); if(!rows.length){toast('There are no records to export.');return;} const cols=['customer','phone','bike','currentMileage','oil','lastDate','nextDueMileage','nextDueDate']; const csv=[cols.join(','),...rows.map(r=>cols.map(c=>`"${String(r[c]??'').replaceAll('"','""')}"`).join(','))].join('\n'); const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='enbull-service-records.csv';a.click();URL.revokeObjectURL(a.href);toast('CSV exported.'); }
render();
