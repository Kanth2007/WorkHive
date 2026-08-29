# 🛠️ WorkHive
### *A Worker-Owned Labor Cooperative & Fair Service Marketplace*

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2F%20In--Memory-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

---

## 📖 Overview

**WorkHive** is an enterprise-grade, multi-role cooperative labor platform designed to eliminate middleman exploitation. By replacing high-commission gig aggregator platforms with a **0% broker commission, 100% direct worker pass-through** model, WorkHive empowers informal trade specialists (electricians, plumbers, carpenters, caregivers, etc.) through democratic ownership, social security welfare, and fair standardized pricing.

---

## ✨ Key Platform Features

### 1. 🛡️ Admin Control Tower (`/admin`)
* **Live Fleet Geospatial Telemetry:** Real-time interactive city map visualizing active dispatches, verified online workers, and customer locations across municipal wards.
* **Worker Verification & KYC Auditing:** Strict administrative verification checklist for trade certificates, ITI diplomas, and UIDAI records before activating workers.
* **Fair Tariff Catalog Management:** Add, edit, regulate, and organize standardized service offerings, durations, and category tariffs with zero platform deductions.
* **Live Operations SOS Safety Feed:** Real-time emergency booking monitor with immediate tracking and resolution controls.
* **Demand Forecasting & Predictive Analytics:** AI-driven demand analytics based on historical seasonal trends, heatmaps, and local trade needs.

### 2. 👷 Worker Portal (`/worker`)
* **Worker Dashboard & Live Availability:** Seamless Online/Offline availability toggle protected by admin verification guards.
* **Smart Job Dispatch & Navigation:** Instant booking request alerts with customer details, arrival PIN verification, and turn-by-turn routing.
* **100% Direct Payouts & Transparent Earnings:** Daily earnings breakdown with direct UPI settlement and 0% commission deductions.
* **Cooperative Democratic Governance:** Member voting interface on cooperative proposals, surplus allocation, and bylaws.
* **Welfare & Social Security:** Health insurance tracking, emergency hardship claims, and maternity/tool subsidy funds.

### 3. 📱 Customer Portal (`/customer`)
* **Multi-Trade Service Catalog:** Browse verified trade categories with fixed, regulated cooperative tariffs.
* **Smart-Match Algorithm:** Geospatial matching optimizing for proximity, verified skills, and top cooperative rating.
* **Live GPS Booking Tracking:** Multi-step progress timeline (*Assigned → On the way → Arrived → In Progress → Completed*).
* **Emergency SOS Service:** Priority instant dispatch for plumbing leakages, electrical hazards, and senior care.
* **Multi-Language Support:** English and Tamil language localization for high accessibility.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, Lucide React, Custom CSS Design System |
| **Backend API** | Node.js, Express.js, RESTful API architecture |
| **Database & ORM** | MongoDB, Mongoose ORM, Embedded `mongodb-memory-server` for zero-setup execution |
| **State & Auth** | Context API (`AuthContext`, `WorkerContext`, `CustomerContext`, `LanguageContext`), 7-Day Session Persistence |

---

## 📂 Project Structure

```text
├── client/                     # Frontend React + Vite Application
│   ├── src/
│   │   ├── apps/
│   │   │   ├── admin/          # Admin Control Tower (Dashboard, Fleet Map, Workers, Services)
│   │   │   ├── customer/       # Customer Portal (Home, Smart Match, Tracking, Emergency)
│   │   │   └── worker/         # Worker Portal (Dashboard, Jobs, Welfare, Voting)
│   │   ├── components/         # Shared UI Design System (Button, Card, Badge, Modal, etc.)
│   │   ├── context/            # Global State Contexts (Auth, Worker, Customer, Language)
│   │   ├── pages/              # Common Auth & Prototype Style Guide Hub
│   │   ├── services/           # Axios API Client Connectors
│   │   └── styles/             # Theme tokens & CSS Component Styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend Express API Server
│   ├── db/                     # MongoDB connection & pristine seed engine
│   ├── mockData/               # Fallback JSON mock data
│   ├── models/                 # Mongoose Schemas (User, Worker, Service, Booking, etc.)
│   ├── routes/                 # Modular REST Endpoints (auth, workers, services, bookings, admin)
│   ├── package.json
│   └── server.js               # Primary Express API server entry point
│
└── package.json                # Root Workspace orchestration scripts
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18.0.0 or higher recommended)
* **npm** (v9.0.0 or higher)

### 1. Installation
Clone the repository and install all workspace dependencies (root, server, and client):

```bash
# Install dependencies across all workspaces
npm run install:all
```

*(Alternatively, run `npm install` inside both the `server/` and `client/` directories).*

---

### 2. Running Locally

#### Start Backend API Server:
```bash
npm run server
```
> The API server boots at **`http://localhost:5000`**. If a local MongoDB daemon is not detected, it automatically initializes an embedded **`mongodb-memory-server`** with pre-seeded cooperative catalogs.

#### Start Frontend Client:
```bash
npm run client
```
> The Vite development server launches at **`http://localhost:5173`**.

---

## 🌐 Quick Access URLs

| Portal | Localhost URL | Description |
| :--- | :--- | :--- |
| **Landing & Hub** | [http://localhost:5173/](http://localhost:5173/) | Prototype selector & design guide |
| **Universal Login** | [http://localhost:5173/login](http://localhost:5173/login) | Role-based authentication portal |
| **Admin Control Tower** | [http://localhost:5173/admin/dashboard](http://localhost:5173/admin/dashboard) | Fleet telemetry & cooperative metrics |
| **Services Catalog** | [http://localhost:5173/admin/services](http://localhost:5173/admin/services) | Add, edit & regulate fair trade tariffs |
| **Fleet Map** | [http://localhost:5173/admin/map](http://localhost:5173/admin/map) | Real-time GPS nodes & dispatch simulation |
| **Worker Dashboard** | [http://localhost:5173/worker/dashboard](http://localhost:5173/worker/dashboard) | Worker jobs, availability & earnings |
| **Worker Registration** | [http://localhost:5173/worker/register](http://localhost:5173/worker/register) | 7-step trade registration & KYC |
| **Customer Portal** | [http://localhost:5173/customer/home](http://localhost:5173/customer/home) | Book services & track specialists |
| **API Health Check** | [http://localhost:5000/api/health](http://localhost:5000/api/health) | Live server & MongoDB engine status |

---

## 📡 REST API Summary

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Register new Customer, Worker, or Admin account |
| `/api/auth/login` | `POST` | Authenticate with phone/email (7-day session token) |
| `/api/workers` | `GET`, `POST` | List all workers or submit new worker application |
| `/api/workers/:id` | `GET`, `PUT`, `DELETE` | View, verify/update, or suspend worker profile |
| `/api/services` | `GET`, `POST` | Fetch all active service categories or create new job |
| `/api/services/:id` | `PUT`, `DELETE` | Update tariff rates or delete service from catalog |
| `/api/bookings` | `GET`, `POST` | View active dispatches or create customer booking |
| `/api/bookings/:id/status` | `PUT` | Advance dispatch status (*Accepted → Arrived → Completed*) |
| `/api/cooperative/proposals` | `GET`, `POST` | View and vote on democratic cooperative proposals |
| `/api/admin/stats` | `GET` | Live cooperative telemetry (Workers, Jobs, Surplus, Welfare) |
| `/api/admin/customers` | `GET` | Retrieve registered customer records |

---

## 📜 Cooperative Ethics & Guidelines
1. **0% Broker Commission:** 100% of customer payments go directly to the specialist.
2. **Democratic Ownership:** One member, one vote for all policy, pricing, and surplus allocations.
3. **Mandatory Verification:** All workers are vetted for safety and vocational certifications prior to active dispatch.

---

## 📄 License
This project is licensed under the **ISC License**.
