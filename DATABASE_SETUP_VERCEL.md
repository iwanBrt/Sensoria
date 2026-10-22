# Panduan Setup Database Vercel Postgres (Neon) - SENSORIA

Aplikasi SENSORIA telah dikonfigurasi dengan arsitektur **Vercel Serverless Functions + Vercel Postgres (didukung oleh Neon DB)**. Sistem ini memiliki kemampuan **hybrid fallback**:
- **Saat di lokal**: Menggunakan local storage berstruktur sama secara otomatis sehingga tetap bisa ditest tanpa koneksi cloud.
- **Saat di Vercel**: Otomatis mendeteksi variabel `POSTGRES_URL` dan menyimpan data secara realtime ke cloud database PostgreSQL.

---

## 📁 Struktur Berkas Database

1. **`vercel.json`**  
   Konfigurasi routing Vercel untuk SPA (Single Page App) dan perutean API endpoint (`/api/*`).

2. **`api/db.js`**  
   Koneksi pooling serverless menggunakan `@neondatabase/serverless` yang membaca kredensial `POSTGRES_URL` atau `DATABASE_URL`.

3. **`api/init.js`**  
   Endpoint otomatis (`POST /api/init`) untuk membuat tabel (`courses`, `students`, `materials`) beserta seed 4 modul vokasi, data siswa binaan, dan master harga bahan baku.

4. **`api/courses.js`, `api/students.js`, `api/materials.js`, `api/status.js`**  
   Endpoint REST API CRUD lengkap untuk modul vokasi, data siswa disabilitas, master bahan, dan pemeriksaan latensi koneksi.

5. **`vercel_postgres_schema.sql`**  
   Skrip SQL DDL & DML lengkap yang siap disalin dan dijalankan di Query Console Vercel Storage.

6. **`src/services/dbService.js`**  
   Layer servis frontend yang mengonsumsi endpoint `/api/*` di Vercel dengan fallback mulus ke penyimpanan lokal.

---

## 🚀 Langkah 1: Hubungkan Vercel Postgres di Dashboard

1. Buka [Vercel Dashboard](https://vercel.com/dashboard).
2. Pilih project **SENSORIA** Anda (atau deploy repository ini ke Vercel jika belum).
3. Klik menu tab **Storage** di bagian atas halaman project.
4. Klik tombol **Create Database** dan pilih **Postgres (Neon)**.
5. Beri nama database (misalnya: `sensoria-db`), pilih region terdekat (misalnya `Singapore (sin1)`), lalu klik **Create**.
6. Klik **Connect to Project** dan pilih project SENSORIA Anda.
7. Vercel akan otomatis menyuntikkan (inject) Environment Variables seperti:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `DATABASE_URL`

---

## ⚡ Langkah 2: Inisialisasi Tabel & Data Awal

Ada **2 cara mudah** untuk menginisialisasi tabel dan data awal:

### Opsi A: Lewat Tombol di Dashboard Admin SENSORIA (Paling Mudah)
1. Buka aplikasi SENSORIA Anda di browser (hasil deploy Vercel).
2. Buka menu **Admin Dashboard** (`/admin`), lalu pilih sub-menu **Pengaturan Database**.
3. Klik tombol **"Inisialisasi Tabel Database"**.
4. Sistem akan otomatis memanggil `/api/init`, membuat semua tabel, dan mengisi modul awal.

### Opsi B: Lewat Vercel SQL Query Console
1. Di Dashboard Vercel, buka tab **Storage** -> pilih database Postgres Anda.
2. Klik tab **Query** / **SQL Console**.
3. Buka file [`vercel_postgres_schema.sql`](./vercel_postgres_schema.sql) di VS Code/editor Anda, lalu salin (copy) seluruh isinya.
4. Tempel (paste) ke dalam Vercel SQL Console, lalu klik **Run Query**.

---

## 🔍 Langkah 3: Verifikasi Koneksi

1. Di Dashboard Admin SENSORIA (`/admin`), pilih tab **Pengaturan Database**.
2. Klik **"Cek Koneksi Vercel"**.
3. Status akan berubah menjadi **"Vercel Postgres Terhubung & Online"** dengan indikator latensi real-time (ms).
