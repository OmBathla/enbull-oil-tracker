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
No setup needed — click the live demo link above, sign up for an account,
then try **Load Sample Data** to see the dashboard populate immediately.

## Features
- Account signup/login, with each account's records kept separate
- Add customer + bike details and log oil-change records
- Auto-calculates next due mileage and date based on oil product interval
- Status badges: **Safe / Due Soon / Overdue**
- Filter records by status, sort by any column
- Search customers by name or phone
- Edit and delete records
- Export records to CSV
- Print a formatted service receipt per customer
- Toast notifications for actions, with basic form validation
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
├── login.html
├── style.css
├── app.js
├── auth-page.js
├── README.md
└── modules/
├── storage.js
├── calculations.js
├── render.js
├── seedData.js
├── toast.js
├── export.js
└── auth.js

## How It Works
1. A user signs up or logs in via `login.html`. Credentials and session are
   stored in `localStorage` — this is a front-end simulation of auth, suited
   to this project's scope, not a production-grade security setup.
2. Each account's service records are stored under its own key
   (`enbullRecords_<email>`), so different accounts never see each other's data.
3. Mechanic enters customer, bike, and oil-change details.
4. `calculations.js` computes the next due mileage/date using fixed
   per-product intervals (e.g., Enbull Standard = 3000 km / 3 months).
5. Status is derived by comparing current mileage/date against the due
   values — Overdue, Due Soon (within 300 km or 7 days), or Safe.

## Setup & Run Locally
1. Clone the repo:git clone https://github.com/OmBathla/enbull-oil-tracker.git
cd enbull-oil-tracker
2. Open with **VS Code** and install the **Live Server** extension.
3. Right-click `login.html` → **Open with Live Server**.
   (Plain double-click won't work — this app uses ES Modules, which
   browsers block on the `file://` protocol.)
4. Sign up for an account, then click **Load Sample Data** to see it populated.

## Screenshots
_Add screenshots here — see `/screenshots` folder._

## Testing
| Test Case | Input | Expected Result | Status |
|---|---|---|---|
| Add valid record | Complete form with valid mileage | Record appears, status calculated correctly | ✅ Passed |
| Invalid mileage | Current mileage < last change mileage | Error toast shown, record not saved | ✅ Passed |
| Status calculation | Mileage/date past due threshold | Status shows "Overdue" | ✅ Passed |
| Search | Partial customer name | Table filters to matching records | ✅ Passed |
| Two accounts | Sign up as two different users | Each sees only their own records | ✅ Passed |

## Future Scope
- Backend + database (Node.js/Express + MongoDB) for real multi-device sync
- Password hashing and proper server-side authentication
- SMS/WhatsApp automated reminders via Twilio API
- Multi-mechanic login and role-based access

## Learning Outcomes
- Modular JavaScript architecture (separation of storage, logic, rendering, auth)
- DOM manipulation without a framework
- Working with the Web Storage API
- Designing a real-world calculation engine (date + mileage logic)
- Implementing a client-side authentication flow with session persistence
- Deploying a static web app with Vercel and version control with Git/GitHub

## Author
Built as a Summer Internship Project, 2026.