# Panduan Deploy SENSORIA (Vercel Free Tier + Supabase Free Tier)

> **Ringkasan:** Anda dapat men-deploy aplikasi **SENSORIA 100% GRATIS SELAMANYA** tanpa memerlukan kartu kredit menggunakan kombinasi:
> - **Frontend Hosting:** Vercel Hobby Plan (Free Tier)
> - **Database Cloud:** Supabase PostgreSQL (Free Tier 500 MB)

---

## 🌟 Mengapa Kombinasi Ini Sangat Ideal?

1. **Vercel Free Tier (Hobby)**:
   - Gratis selamanya untuk web app non-komersial/edukasi.
   - Kecepatan CDN global tercepat, custom domain gratis, dan otomatis SSL (HTTPS).
   - Otomatis melakukan build & deploy setiap kali Anda push kode ke GitHub.

2. **Supabase Free Tier**:
   - Gratis selamanya dengan database PostgreSQL asli berkapasitas 500 MB (cukup untuk ribuan modul, data siswa, dan teks CC).
   - Akses langsung dari browser via REST API & Row Level Security (RLS) tanpa beban server.
   - Dashboard GUI interaktif untuk melihat dan mengedit tabel secara langsung.

---

## 🛠️ Langkah-Langkah Setup (Hanya 3 Langkah Cepat)

### Langkah 1: Buat Database di Supabase
1. Masuk ke [supabase.com](https://supabase.com) dan buat akun gratis.
2. Klik **New Project**, beri nama project (misalnya: `sensoria-db`).
3. Tentukan password database dan pilih Region terdekat (contoh: **Singapore (sin)**).
4. Klik **Create new project** (tunggu ~1 menit hingga database siap).

---

### Langkah 2: Jalankan Skrip Database Lengkap
1. Di dashboard Supabase proyek Anda, klik menu **SQL Editor** pada bilah samping kiri (ikon `>_`).
2. Klik tombol **New query**.
3. Buka file [`supabase_schema.sql`](./supabase_schema.sql) di folder proyek ini.
4. Salin seluruh isi filenya, tempel (paste) ke SQL Editor Supabase, lalu klik tombol **Run** (atau tekan `Ctrl + Enter`).
5. Selesai! Tabel `courses`, `students`, `materials`, aturan keamanan RLS, dan seluruh data awal modul vokasi otomatis terbuat.

---

### Langkah 3: Sambungkan ke Vercel
1. Buka [vercel.com](https://vercel.com) dan impor repository GitHub SENSORIA Anda.
2. Pada bagian **Configure Project** sebelum klik deploy (atau di menu **Settings ➔ Environment Variables** jika sudah ter-deploy):
   - Ambil kredensial dari Supabase: buka **Project Settings** ➔ **API**.
   - Tambahkan 2 Environment Variable berikut di Vercel:
     - `VITE_SUPABASE_URL` : Isikan *Project URL* (contoh: `https://xyzcompany.supabase.co`)
     - `VITE_SUPABASE_ANON_KEY` : Isikan *Project API anon public key* (`eyJhbGciOi...`)
3. Klik **Deploy**.

---

## 🔍 Cara Memeriksa Status Koneksi

Setelah di-deploy:
1. Buka web SENSORIA Anda di browser.
2. Masuk sebagai **Admin** ➔ buka tab **Pengaturan Database**.
3. Klik tombol **Cek Koneksi Database**.
4. Status akan menampilkan **"Supabase Cloud (PostgreSQL Free Tier) Terhubung & Online"** dengan indikator latensi real-time!
