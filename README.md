# 🏢 System Enterprise Man Power Control & Realisasi SAP (Project ISTEK)

Sistem Enterprise Man Power Control & Realisasi SAP adalah platform manajemen tenaga kerja enterprise, perencanaan operasional pabrik, manajemen task Scope of Work (SOW), serta pemantauan realisasi Work Order (WO) & Notification dari SAP secara real-time. Sistem ini juga terintegrasi dengan Google Gemini AI untuk pembuatan ringkasan eksekutif dan rekomendasi operasional secara otomatis.

---

## 📋 Daftar Isi
1. [Tentang Aplikasi](#-tentang-aplikasi)
2. [Fitur Utama](#-fitur-utama)
3. [Technology Stack](#-technology-stack)
4. [Library & Dependensi](#-library--dependensi)
5. [Arsitektur & Struktur File/Folder](#-arsitektur--struktur-filefolder)
6. [Schema Database](#-schema-database)
7. [API & Integrasi External](#-api--integrasi-external)
8. [Cara Setup Project](#-cara-setup-project)
9. [Cara Menjalankan Aplikasi](#-cara-menjalankan-aplikasi)
10. [Cara Pengujian (Testing)](#-cara-pengujian-testing)

---

## 🚀 Tentang Aplikasi

Aplikasi ini dikembangkan untuk memfasilitasi koordinasi lintas divisi (Management, PPHS & OSBL, Rotating 1, Rotating 2, Static) pada fasilitas industri enterprise. Pengguna dapat memantau status kehadiran personil, mengelola pengajuan perubahan status (Cuti, Sakit, Dinas, Training, Lembur), menyusun perencanaan program kerja (TA, Shutdown, Overhaul, Maintenance), menugaskan task SOW, serta melacak progres Work Order SAP.

---

## ✨ Fitur Utama

- **📊 Dashboard Overview & Metrics**: Visualisasi kehadiran harian, absensi personil per area, statistik WO & Notification SAP, serta persentase ketercapaian target realisasi.
- **👥 Man Power Control**: Manajemen presensi harian, pengajuan izin/cuti/dinas, kuota cuti personil, serta approval berjenjang (Supervisor, SIE, AVP, VP).
- **📋 Perencanaan Personel**: Penyusunan proposal program (Turn Around, Shutdown, Overhaul), alokasi tenaga kerja, hirarki tanda tangan approval, dan generasi Ringkasan Eksekutif berbasis AI.
- **📌 Manajemen Task SOW**: Pembagian tugas spesifik berdasarkan program kerja, penetapan PIC & lokasi area, timeline target, manajemen prioritas, serta log aktivitas real-time.
- **⚙️ Data & Realisasi SAP**: Pemantauan status Work Order (PM01 - PM04, status REL, CNF, TECO, CRTD) dan SAP Notifications (OSNO, NOPR, ORAS, NOCO) per lokasi pabrik (Ammonia, Urea, Utility, PPHS, Off-Site).
- **👤 Data Profil Personel**: Direktori pegawai organik dan non-organik beserta detail NPK, posisi, dan kuota cuti.
- **🤖 Generative AI Assistant**: Terintegrasi dengan Google Gemini 2.5 Flash API untuk penulisan otomatis SOW dan ringkasan eksekutif program.

---

## 🛠 Technology Stack

- **Frontend Core**: React 18 (TypeScript)
- **Styling**: Tailwind CSS, CSS-in-JS Global Styles (Inter & Poppins Font)
- **State Management**: React State & Context
- **Build Tool / Bundler**: Vite / React Scripts
- **Runtime & Package Manager**: Node.js (>= v18.0.0), npm / yarn / pnpm

---

## 📦 Library & Dependensi

| Library | Fungsi Utama | Catatan Penggunaan |
|---------|--------------|--------------------|
| `react` | Library UI Utama | Mengelola komponen UI berbasis TypeScript |
| `react-dom` | DOM Renderer | Rendering komponen React ke DOM browser |
| `lucide-react` | Iconography Modern | Icon set lengkap (`Bell`, `Users`, `Kanban`, `Database`, `Star`, `Shield`, `HardHat`, dll.) |
| `recharts` | Visualisasi Data Chart | Komponen grafik interaktif (`PieChart`, `Pie`, `Cell`, `ResponsiveContainer`) pada Dashboard |
| `@google/generative-ai` / Fetch API | Integrasi AI Engine | Modul komunikasi REST API ke Gemini 2.5 Flash Preview |

---

## 📁 Arsitektur & Struktur File/Folder

### 🌳 Pohon Direktori (Directory Tree)
```
Project ISTEK/
├── README.md
├── src/
│   ├── App.tsx
│   ├── components/
│   │   ├── Modal.tsx
│   │   ├── PersonnelCard.tsx
│   │   └── StatusBadge.tsx
│   ├── data/
│   │   └── mockData.ts
│   ├── pages/
│   │   ├── Dashboard/
│   │   │   └── DashboardView.tsx
│   │   ├── ManPower/
│   │   │   └── ManPowerView.tsx
│   │   ├── Perencanaan/
│   │   │   └── PerencanaanView.tsx
│   │   ├── SAPData/
│   │   │   └── SAPDataView.tsx
│   │   └── Tasks/
│   │       └── TaskView.tsx
│   ├── styles/
│   │   └── GlobalStyles.tsx
│   └── utils/
│       ├── geminiApi.ts
│       └── helpers.ts
```

### 🏷 Penamaan File & Konvensi
1. **React Views / Pages (`src/pages/*/*.tsx`)**: Menggunakan **PascalCase** dengan sufiks `View` (contoh: `DashboardView.tsx`, `ManPowerView.tsx`, `PerencanaanView.tsx`, `SAPDataView.tsx`, `TaskView.tsx`).
2. **React Components (`src/components/*.tsx`)**: Menggunakan **PascalCase** (contoh: `Modal.tsx`, `PersonnelCard.tsx`, `StatusBadge.tsx`).
3. **Utilities & Services (`src/utils/*.ts`)**: Menggunakan **camelCase** (contoh: `geminiApi.ts`, `helpers.ts`).
4. **Data Models / Seed (`src/data/*.ts`)**: Menggunakan **camelCase** (contoh: `mockData.ts`).

---

## 🗄 Schema Database

Aplikasi saat ini mengelola data state dan master data terstruktur (`src/data/mockData.ts`) yang dipersiapkan untuk skema database relasional (RDBMS / PostgreSQL / MySQL / MongoDB):

### 1. Table `users`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `INTEGER` (PK) | Unique ID User |
| `emp_id` | `INTEGER` (FK -> `employees.id`) | ID Pegawai terkait |
| `name` | `VARCHAR(255)` | Nama Pengguna |
| `role` | `ENUM('Administrator', 'Manager', 'Supervisor', 'User')` | Role Hak Akses System |
| `position` | `VARCHAR(255)` | Jabatan (mis: VP, SIE, AVP, Staff Planner) |

### 2. Table `employees`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `INTEGER` (PK) | Unique ID Pegawai |
| `npk` | `VARCHAR(50)` | Nomor Pokok Karyawan |
| `name` | `VARCHAR(255)` | Nama Lengkap Pegawai |
| `employee_type` | `ENUM('Organik', 'Non Organik')` | Status Kepegawaian |
| `division` | `VARCHAR(100)` | Divisi (Management, PPHS & OSBL, Rotating 1, Rotating 2) |
| `position` | `VARCHAR(255)` | Jabatan Pegawai |
| `quota_cuti` | `INTEGER` | Sisa Kuota Cuti Tahunan |

### 3. Table `attendance_changes`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `INTEGER` (PK) | Unique ID Pengajuan Kehadiran |
| `employee_id` | `INTEGER` (FK -> `employees.id`) | Reference Pegawai |
| `start_date` | `DATE` | Tanggal Mulai Perubahan |
| `end_date` | `DATE` | Tanggal Selesai Perubahan |
| `status_id` | `INTEGER` (FK -> `statuses.id`) | ID Status Kehadiran |
| `note` | `TEXT` | Keterangan/Alasan Pengajuan |
| `status` | `ENUM('Pending', 'Approved', 'Rejected')` | Status Approval |
| `duration` | `INTEGER` | Jumlah Hari Kehadiran |

### 4. Table `statuses`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `INTEGER` (PK) | ID Status Kehadiran |
| `code` | `VARCHAR(50)` | Kode Status (Hadir, OFF, Cuti, Sakit, Dinas Luar, dll.) |
| `name` | `VARCHAR(100)` | Deskripsi Nama Status |
| `color` | `VARCHAR(50)` | Tailwind text color class |
| `bg` | `VARCHAR(50)` | Tailwind background color class |

### 5. Table `plans`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `INTEGER` (PK) | ID Rencana Perencanaan |
| `title` | `VARCHAR(255)` | Judul Program Perencanaan |
| `program_type` | `ENUM('Turn Around (TA)', 'Shutdown', 'Overhaul', 'Project', 'Commissioning', 'Startup', 'Major Maintenance', 'Lainnya')` | Jenis Program |
| `description` | `TEXT` | Deskripsi Program Kerja |
| `start_date` | `DATE` | Tanggal Mulai Program |
| `end_date` | `DATE` | Tanggal Selesai Program |
| `needed_manpower` | `INTEGER` | Kebutuhan Tenaga Kerja |
| `allocated_personnel` | `JSON` / `Array[INTEGER]` | List ID Pegawai yang Dialokasikan |
| `status` | `ENUM('Draft', 'Pending Approval', 'Approved', 'Rejected')` | Status Rencana |
| `history` | `JSON` | Log Riwayat Pengajuan & Approval |
| `signatures` | `JSON` | List Tanda Tangan Digital Approver |

### 6. Table `tasks`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `INTEGER` (PK) | Unique ID Task |
| `plan_id` | `INTEGER` (FK -> `plans.id`) | Reference Rencana Perencanaan |
| `title` | `VARCHAR(255)` | Judul Pekerjaan / Task |
| `description` | `TEXT` | Scope of Work (SOW) Detail |
| `pic` | `VARCHAR(255)` | Person In Charge |
| `area` | `ENUM('AMMONIA', 'UREA', 'UTILITY', 'PPHS', 'OFF-SITE')` | Lokasi Area Pekerjaan |
| `execution_date` | `DATE` | Tanggal Pelaksanaan Pekerjaan |
| `target_date` | `DATE` | Tanggal Target Selesai Pekerjaan |
| `priority` | `ENUM('Rendah', 'Sedang', 'Tinggi')` | Tingkat Prioritas |
| `status` | `ENUM('Backlog', 'To Do', 'In Progress', 'Done')` | Status Progres Task |
| `assignees` | `JSON` | List ID Pegawai Pelaksana |
| `logs` | `JSON` | Log Milestone Pekerjaan |

### 7. Table `sap_work_orders` & `sap_notifications`
| Table | Field & Deskripsi |
|-------|-------------------|
| `sap_work_orders` | `id`, `order` (No WO), `equipment`, `sortField` (Area), `description`, `orderType` (PM01-PM04), `workCenter`, `systemStatus` (CNF, REL, TECO, CRTD), `basicFinishDate` |
| `sap_notifications` | `id`, `notifNo` (No Notif), `equipment`, `sortField` (Area), `description`, `systemStatus` (OSNO, NOPR, ORAS, NOCO), `date` |

---

## 🌐 API & Integrasi External

### Google Gemini AI API (`src/utils/geminiApi.ts`)
Aplikasi memanfaatkan Google Gemini API untuk pembuatan deskripsi Scope of Work (SOW) dan Ringkasan Eksekutif Perencanaan secara otomatis.

#### Method Signature:
```typescript
callGeminiLLM(
  prompt: string, 
  systemInstruction?: string
): Promise<string>
```

#### Spesifikasi Endpoint:
- **URL**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key={API_KEY}`
- **HTTP Method**: `POST`
- **Headers**: `'Content-Type': 'application/json'`
- **Payload Request Structure**:
```json
{
  "contents": [
    {
      "parts": [{ "text": "Buat ringkasan eksekutif..." }]
    }
  ],
  "systemInstruction": {
    "parts": [{ "text": "Anda adalah konsultan operasional pabrik." }]
  }
}
```

#### Ketahanan Network (Resilience Mechanism):
- **Exponential Backoff**: Retry otomatis hingga 5 kali dengan rentang delay `[1000ms, 2000ms, 4000ms, 8000ms, 16000ms]`.
- **Graceful Fallback**: Ketika `apiKey` belum terkonfigurasi, sistem memberikan respon jawaban simulasi terstruktur tanpa menghentikan runtime aplikasi.

---

## ⚙️ Cara Setup Project

### 1. Prasyarat Sistem
- **Node.js**: Versi `18.0.0` atau lebih tinggi.
- **npm**: Versi `9.0.0` atau lebih tinggi (bisa juga menggunakan `yarn` / `pnpm`).

### 2. Langkah Instalasi

1. Clone repositori ke komputer lokal Anda:
   ```bash
   git clone <URL_REPOSITORY>
   cd "Project ISTEK"
   ```

2. Install dependensi project:
   ```bash
   npm install
   ```

3. (Opsional) Konfigurasi Gemini API Key:
   Buka file `src/utils/geminiApi.ts` dan masukkan API Key Anda pada variabel `apiKey`:
   ```typescript
   const apiKey = 'YOUR_GEMINI_API_KEY';
   ```

---

## 🚀 Cara Menjalankan Aplikasi

### Mode Pengembangan (Development)
Untuk menjalankan server lokal dengan fitur Hot Module Replacement (HMR):

```bash
npm run dev
```
atau:
```bash
npx vite
```

Aplikasi dapat diakses melalui browser pada alamat default:
`http://localhost:5173`

### Mode Produksi (Production Build)
Untuk melakukan build bundel teroptimasi siap deploy:

```bash
npm run build
```

---

## 🧪 Cara Test Aplikasi

### 1. Pengujian Manual (Manual Functional Testing Checklist)

#### 🔹 Modul Overview / Dashboard (`DashboardView.tsx`)
- [ ] Verifikasi ketersediaan widget kehadiran harian.
- [ ] Uji kalkulasi rasio pencapaian realisasi Work Order & Notification SAP.

#### 🔹 Modul Man Power Control (`ManPowerView.tsx`)
- [ ] Filter data pegawai berdasarkan tanggal.
- [ ] Uji pengajuan perubahan presensi (Cuti/Dinas/Sakit) dan verifikasi respon perubahan status.

#### 🔹 Modul Perencanaan Personel (`PerencanaanView.tsx`)
- [ ] Buat program perencanaan baru.
- [ ] Pilih alokasi tenaga kerja dan alur tanda tangan approval (VP/AVP).
- [ ] Klik **Generate Ringkasan AI** untuk memverifikasi pemanggilan Gemini API.

#### 🔹 Modul Manajemen Task SOW (`TaskView.tsx`)
- [ ] Tambahkan Task baru pada program perencanaan yang aktif.
- [ ] Uji pergerakan status Task (`Backlog` -> `In Progress` -> `Done`).
- [ ] Gunakan fitur **Bantu Tulis SOW (AI)** untuk membuat deskripsi SOW otomatis.

#### 🔹 Modul Data & Realisasi SAP (`SAPDataView.tsx`)
- [ ] Lakukan simulasi pengunggahan log WO & Notification SAP.
- [ ] Filter data berdasarkan status sistem (`CNF`, `REL`, `TECO`, `CRTD`) dan area lokasi (`Ammonia`, `Urea`).

---

### 2. Running Automated Unit Testing

Untuk menguji fungsi utility (`src/utils/helpers.ts` & `src/utils/geminiApi.ts`) dengan runner seperti Vitest/Jest:

```bash
# Menjalankan unit test
npm test

# Menjalankan test dalam mode watch
npm test -- --watch
```

---
*Dikembangkan untuk mendukung efisiensi operasional, keandalan fasilitas industri, dan ketepatan alokasi sumber daya manusia (Project ISTEK).*
