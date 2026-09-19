# Enbull Oil Change Reminder & Customer Management System

🔗 **Live Demo:** [enbull-oil-tracker-crlw.vercel.app](https://enbull-oil-tracker-crlw.vercel.app)

A lightweight, offline-capable web app for motorcycle service mechanics to log
oil changes and automatically track when each customer's bike is due for its
next service — built as a summer internship project.

## Problem Statement
Local bike service centers using Enbull oil products had no digital way to
track customer service history, causing missed reminders and lost repeat
business. This app solves that with zero infrastructure cost — no server,
no database, works entirely in-browser.

## Try It Instantly
No setup needed — click the live demo link above and try **Load Sample Data**
to see the dashboard populate immediately.

## Features
- Add customer + bike details and log oil-change records
- Auto-calculates next due mileage and date based on oil product interval
- Status badges: **Safe / Due Soon / Overdue**
- Search customers by name or phone
- Edit and delete records
- Dashboard: total customers, due-soon count, overdue count
- Data persists locally via the Web Storage API (`localStorage`)

## Tech Stack
- HTML5, CSS3
- Vanilla JavaScript (ES Modules)
- Web Storage API — no backend, no database
- Deployed on Vercel

## Project Structure

enbull-oil-tracker/
├── index.html
├── style.css
├── app.js
├── README.md
└── modules/
├── storage.js
├── calculations.js
├── render.js
└── seedData.js



## How It Works
1. Mechanic enters customer, bike, and oil-change details.
2. `calculations.js` computes the next due mileage/date using fixed
   per-product intervals (e.g., Enbull Standard = 3000 km / 3 months).
3. Status is derived by comparing current mileage/date against the due
   values — Overdue, Due Soon (within 300 km or 7 days), or Safe.
4. All records are saved to `localStorage` as JSON, so data survives
   page refreshes with no server.

## Setup & Run Locally
1. Clone the repo: git clone https://github.com/OmBathla/enbull-oil-tracker.git
cd enbull-oil-tracker
2. Open with **VS Code** and install the **Live Server** extension.
3. Right-click `index.html` → **Open with Live Server**.
   (Plain double-click won't work — this app uses ES Modules, which
   browsers block on the `file://` protocol.)
4. Click **Load Sample Data** to see it populated, or add your own records.

## Screenshots
_Add screenshots here — see `/screenshots` folder._

## Future Scope
- Backend + database (Node.js/Express + MongoDB) for multi-device sync
- SMS/WhatsApp automated reminders via Twilio API
- Multi-mechanic login and role-based access
- Export records to CSV/PDF

## Learning Outcomes
- Modular JavaScript architecture (separation of storage, logic, rendering)
- DOM manipulation without a framework
- Working with the Web Storage API
- Designing a real-world calculation engine (date + mileage logic)
- Deploying a static web app with Vercel and version control with Git/GitHub

## Author
Built as a Summer Internship Project, 2026.