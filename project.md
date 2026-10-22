# Project Overview: SENSORIA Web App

## Deskripsi
SENSORIA adalah Inovasi Media Pembelajaran Adaptif Berbasis Multisensori Digital. Tujuan utama web ini adalah memperluas akses pendidikan inklusif (vokasi dan kewirausahaan/akuntansi) bagi anak disabilitas sensorik.

## Tech Stack
- **Frontend Framework:** React (Vite)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Language:** JavaScript/JSX (atau TypeScript jika memungkinkan)
- **Routing:** React Router DOM

## Agent Coding Rules & Guidelines
1. **Accessibility First (Wajib):** 
   - Semua elemen interaktif HARUS menggunakan semantic HTML.
   - Gunakan atribut `aria-label`, `aria-live`, dan `role` pada form, kalkulator, dan notifikasi.
   - Mendukung navigasi penuh menggunakan *keyboard* (Tab & Enter).
2. **Modular Components:** Pisahkan UI menjadi komponen kecil (contoh: `VideoPlayer.jsx`, `Calculator.jsx`, `A11yToolbar.jsx`).
3. **Responsive & High Contrast:** Gunakan Tailwind untuk memastikan ukuran teks bawaan besar (min `text-lg`), dan dukung fitur *toggle* ke *High Contrast Mode* (Hitam/Kuning).
4. **State Management:** Gunakan React Hooks (`useState`, `useEffect`) untuk mengelola *state* kalkulator laba/rugi dan *toggle* aksesibilitas (ukuran teks, kontras).

## Struktur Direktori yang Diharapkan
src/
 ├── components/
 │    ├── layout/ (Header, Footer, A11yToolbar)
 │    ├── learning/ (VideoPlayer, StepNavigation)
 │    └── accounting/ (CostCalculator, ProfitResult)
 ├── pages/
 │    ├── Home.jsx
 │    └── CourseModule.jsx
 ├── context/ (A11yContext.jsx untuk global state aksesibilitas)
 └── App.jsx