# Product Requirements Document (PRD) - SENSORIA

## 1. Target Pengguna & Hambatan
Aplikasi ini harus secara adaptif menyelesaikan hambatan pengguna berikut:
- **Tunanetra:** Teks/gambar tidak terbaca -> Butuh *Mode Dengar* (Narasi audio, navigasi keyboard, WCAG 1.1.1, 1.2.5, 2.1.1).
- **Kurang Awas (Low Vision):** Huruf kecil, kontras rendah -> Butuh fitur perbesaran teks, *High Contrast*, desain sederhana (WCAG 1.4.3, 1.4.4).
- **Tunarungu:** Audio tidak terdengar -> Butuh *Mode Lihat* (Takarir/CC, tempat untuk Juru Bahasa Isyarat, umpan balik visual/animasi) (WCAG 1.2.2).
- **Tunawicara:** Sulit memberi respons lisan -> Interaksi murni ketuk/ketik/pilih, tidak ada fitur wajib rekam suara (UDL - CAST 2018).

## 2. Fitur Utama (Core Features)

### A. Accessibility Toolbar (Global)
- Tombol *Toggle High Contrast* (Mengubah tema menjadi warna latar hitam gelap dan teks kuning/putih tebal).
- Tombol Perbesar/Perkecil Ukuran Font (A+ / A-).
- Tombol pengaktifan *Screen Reader Assist* (mengaktifkan *aria-live*).

### B. Modul Pembelajaran Vokasi (Video & Materi)
- Halaman pembelajaran memiliki tata letak terpusat.
- Komponen `VideoPlayer` khusus:
  - Memiliki *frame* kecil di sudut (Picture-in-Picture) untuk video Juru Bahasa Isyarat (JBI).
  - Tombol CC (Closed Captions) berukuran besar dan mudah diakses.

### C. Modul Akuntansi & Kewirausahaan (Kalkulator Laba Rugi)
- **Tujuan:** Anak disabilitas dapat menghitung modal pembuatan produk dan laba.
- **Input Fields (Sangat besar dan ramah ketuk):**
  1. Input Total Biaya Bahan (Modal).
  2. Input Harga Jual Produk.
- **Proses Logika:** `Keuntungan = Harga Jual - Modal`
- **Output (Visual & Screen Reader):**
  - Kotak hasil berwarna cerah.
  - Teks besar menampilkan sisa laba atau rugi.
  - *Feedback Visual:* Muncul animasi bintang/konfeti jika untung (Bagus untuk Tunarungu).
  - *Feedback Audio:* Dibacakan otomatis oleh atribut `aria-live` (Bagus untuk Tunanetra).

## 3. User Flow Pembelajaran
1. User masuk ke "Kelas Membuat Lilin Aromaterapi".
2. User menonton video bahan dan proses pembuatan (Video didukung takarir & JBI).
3. Setelah selesai, user mengklik tab "Hitung Untung".
4. User memasukkan angka di kalkulator biaya.
5. Sistem memberikan hasil laba secara visual dan dapat didengar.