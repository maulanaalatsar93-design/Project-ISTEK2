# 📌 Issue & Task Planning: Pengembangan Aplikasi "Inspeksi Teknik 2"

Dokumen planning ini dirancang sebagai panduan eksekusi high-level untuk agen/program pengembang dalam membangun dan memigrasikan aplikasi **Inspeksi Teknik 2**.

---

## 🎯 Target & Objek Proyek

Membangun platform enterprise **Inspeksi Teknik 2** (Man Power Control, Perencanaan Operasional Pabrik, Task Management SOW, dan Realisasi Data SAP) dengan infrastruktur modern berbasis **Bun** dan basis data relasional **MySQL**.

---

## 🛠 Spesifikasi Tech Stack

- **Runtime & Package Manager**: Bun (Node.js compatible)
- **Frontend Framework**: React.js (TypeScript)
- **Styling Framework**: Tailwind CSS
- **Database Engine**: MySQL

---

## 📋 High-Level Implementation Steps

### Task 1: Project Initialization & Environment Setup
- Inisialisasi proyek React.js menggunakan **Bun** (`bun create vite` / `bun init`).
- Konfigurasi dan integrasikan **Tailwind CSS** sebagai engine styling utama.
- Setup struktur folder backend/API service (Node.js runtime di atas Bun) dan konektor database MySQL.

### Task 2: Database Design & Migration (MySQL)
- Buat skema database **MySQL** berdasarkan data entitas sistem:
  - Tabel Master: `users`, `employees`, `statuses`
  - Tabel Operasional: `attendance_changes`, `plans`, `tasks`
  - Tabel SAP Integration: `sap_work_orders`, `sap_notifications`
- Sediakan script migrasi dan seed data awal ke database MySQL.

### Task 3: Backend API Service Development
- Buat API Endpoint RESTful / Server Actions menggunakan Node.js/Bun service:
  - **Auth & User API**: Manajemen user role (VP, SIE, AVP, Staff).
  - **Manpower API**: Presensi harian, permohonan & approval status cuti/dinas/sakit.
  - **Perencanaan API**: Pengajuan program kerja (TA, Shutdown, Overhaul) & alokasi personil.
  - **Task SOW API**: Manajemen tugas Kanban (Backlog, In Progress, Done) & log milestone.
  - **SAP Realization API**: Monitoring & sinkronisasi data WO & Notif SAP.

### Task 4: Frontend UI Migration & API Integration
- Hubungkan komponen UI React.js dengan API MySQL:
  - **Dashboard Overview**: Metric presensi & chart realisasi SAP WO/Notif.
  - **Man Power Control**: Presensi & flow approval berjenjang.
  - **Perencanaan Personel**: Form proposal program & integrasi tanda tangan digital.
  - **Manajemen Task**: Kanban board & tracking PIC per area.
  - **Data SAP**: Filter & upload log realisasi.

### Task 5: AI Engine & External Services Integration
- Integrasikan layanan Google Gemini AI API untuk:
  - Penulisan otomatis deskripsi Scope of Work (SOW).
  - Pembentukan Ringkasan Eksekutif pada Perencanaan Program.
- Sediakan mekanisme fallback respons AI jika API key tidak tersedia.

### Task 6: Testing, Optimization & Deployment
- Pengujian integrasi end-to-end (E2E) dari React UI ke MySQL Database.
- Pengujian kecepatan & performa build menggunakan Bun.
- Penyiapan instruksi deployment dan dokumentasi rilis aplikasi.
