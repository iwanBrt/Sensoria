-- ==============================================================================
-- SENSORIA: Database Schema untuk Vercel Postgres / Neon PostgreSQL
-- Salin dan jalankan seluruh script ini di:
-- Dashboard Vercel -> Project Anda -> Tab "Storage" -> Postgres -> "Query" / SQL Editor
-- ==============================================================================

-- 1. Tabel Modul Vokasi (Courses)
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  duration_text TEXT,
  default_modal NUMERIC DEFAULT 0,
  default_price NUMERIC DEFAULT 0,
  description TEXT,
  steps JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabel Siswa Disabilitas Binaan (Students)
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sensory_profile TEXT NOT NULL, -- 'netra', 'kurang_awas', 'rungu', 'wicara'
  profile_label TEXT,
  school TEXT,
  progress_summary TEXT,
  last_active TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabel Master Biaya Bahan Baku (Materials)
CREATE TABLE IF NOT EXISTS materials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  unit TEXT NOT NULL,
  cost NUMERIC NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Indexing untuk kecepatan pencarian
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_students_profile ON students(sensory_profile);

-- 5. Seed Data Awal: Modul Praktik Lilin Aromaterapi Lavender
INSERT INTO courses (id, title, category, duration_text, default_modal, default_price, description, steps)
VALUES (
  'lilin-aromaterapi',
  'Pembuatan Lilin Aromaterapi Lavender',
  'Kriya & Kerajinan',
  '4 Langkah • 15 Menit',
  15000,
  35000,
  'Keterampilan membuat lilin kedelai ramah lingkungan dengan wangi minyak aromaterapi yang menenangkan.',
  '[
    {
      "id": 1,
      "title": "1. Persiapan Alat dan Bahan Baku",
      "duration": 35,
      "summary": "Siapkan serpihan lilin kedelai (soy wax), wadah toples kaca tahan panas, sumbu katun bebas timbal, dan minyak esensial lavender.",
      "audioDescription": "Instruktur meletakkan toples kaca, mangkuk berisi lilin kedelai putih, dan botol minyak lavender di atas meja kerja.",
      "materials": ["Serpihan Lilin Kedelai (Soy Wax) 200 gram", "Sumbu Katun Bebas Timbal", "Minyak Esensial Lavender 10 ml", "Toples Kaca Tahan Panas"],
      "subtitles": [
        {"start": 0, "end": 10, "text": "Selamat datang di kelas vokasi SENSORIA. Hari ini kita belajar membuat lilin aromaterapi."},
        {"start": 10, "end": 22, "text": "Lilin kedelai alami sangat aman bagi kesehatan dan ramah lingkungan."},
        {"start": 22, "end": 35, "text": "Pastikan semua bahan sudah tersusun rapi di atas meja sebelum mulai."}
      ]
    },
    {
      "id": 2,
      "title": "2. Pelelehan Lilin Kedelai",
      "duration": 40,
      "summary": "Panaskan mangkuk lilin di atas panci air panas dengan teknik pemanasan tidak langsung hingga mencair merata.",
      "audioDescription": "Serpihan lilin di dalam mangkuk perlahan mencair terkena uap air mendidih menjadi cairan kuning bening.",
      "materials": ["Panci pemanas air", "Mangkuk wadah lilin tahan panas", "Sendok pengaduk kayu"],
      "subtitles": [
        {"start": 0, "end": 12, "text": "Panaskan mangkuk berisi lilin di atas panci air hangat secara perlahan."},
        {"start": 12, "end": 26, "text": "Aduk perlahan menggunakan sendok kayu hingga seluruh butiran lilin mencair."},
        {"start": 26, "end": 40, "text": "Setelah mencair sempurna, matikan kompor dan biarkan suhu lilin menurun sejenak."}
      ]
    },
    {
      "id": 3,
      "title": "3. Pencampuran Aroma dan Penuangan",
      "duration": 45,
      "summary": "Teteskan minyak lavender saat lilin hangat kuku. Pasang sumbu di tengah toples, lalu tuang lilin perlahan hingga penuh.",
      "audioDescription": "Minyak aromaterapi diteteskan ke lilin cair. Lilin dituangkan ke toples dengan sumbu terjepit tegak di bagian tengah.",
      "materials": ["Minyak esensial lavender", "Penjepit kayu penyangga sumbu", "Lap kain pembersih"],
      "subtitles": [
        {"start": 0, "end": 14, "text": "Teteskan minyak esensial ketika lilin hangat agar aroma wangi tidak cepat menguap."},
        {"start": 14, "end": 28, "text": "Posisikan sumbu lilin tepat di tengah toples menggunakan bantuan penjepit kayu."},
        {"start": 28, "end": 45, "text": "Tuang lilin cair ke toples secara perlahan dan biarkan memadat selama 3 jam."}
      ]
    },
    {
      "id": 4,
      "title": "4. Penyempurnaan Sumbu dan Pelabelan",
      "duration": 35,
      "summary": "Gunting sumbu hingga tersisa sekitar setengah sentimeter. Tempelkan label nama usahamu pada toples kaca.",
      "audioDescription": "Lilin telah mengeras putih pekat. Instruktur merapikan sumbu dengan gunting dan menempelkan stiker merek produk.",
      "materials": ["Gunting tajam", "Stiker label merek lilin", "Kemasan karton pengaman"],
      "subtitles": [
        {"start": 0, "end": 12, "text": "Setelah lilin memadat sepenuhnya, potong kelebihan sumbu dengan gunting."},
        {"start": 12, "end": 24, "text": "Tempelkan stiker label usahamu dengan rapi pada permukaan toples."},
        {"start": 24, "end": 35, "text": "Produk lilin aromaterapimu telah siap dipasarkan. Sekarang mari hitung keuntungannya."}
      ]
    }
  ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 6. Seed Data Awal: Modul Praktik Sabun Cuci Tangan Herbal
INSERT INTO courses (id, title, category, duration_text, default_modal, default_price, description, steps)
VALUES (
  'sabun-organik',
  'Pembuatan Sabun Cuci Tangan Herbal',
  'Kriya & Sanitasi',
  '4 Langkah • 20 Menit',
  12000,
  28000,
  'Keterampilan memproduksi sabun pembersih berbahan dasar minyak kelapa dan lidah buaya yang lembut di kulit.',
  '[
    {
      "id": 1,
      "title": "1. Menyiapkan Bahan Dasar Sabun",
      "duration": 30,
      "summary": "Siapkan basis sabun gliserin transparan, ekstrak lidah buaya, cetakan silikon, dan pewangi alami.",
      "audioDescription": "Potongan bahan sabun bening berbentuk kubus kecil tertata rapi di samping cetakan silikon biru.",
      "materials": ["Sabun gliserin nabati 250 gram", "Gel lidah buaya segar 20 ml", "Cetakan sabun silikon"],
      "subtitles": [
        {"start": 0, "end": 10, "text": "Selamat datang di kelas pembuatan sabun herbal mandiri."},
        {"start": 10, "end": 20, "text": "Kita menggunakan bahan sabun gliserin alami yang sangat aman diproses."},
        {"start": 20, "end": 30, "text": "Potong bahan sabun menjadi dadu kecil agar cepat mencair saat dipanaskan."}
      ]
    }
  ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 7. Seed Data Awal: Modul Tata Boga Kue Kering Chocochips
INSERT INTO courses (id, title, category, duration_text, default_modal, default_price, description, steps)
VALUES (
  'kue-kering',
  'Tata Boga: Produksi Kue Kering Chocochips',
  'Kuliner & Tata Boga',
  '4 Langkah • 25 Menit',
  20000,
  45000,
  'Pelatihan membuat kue kering cokelat renyah dengan takaran presisi dan teknik pengemasan toples kedap udara.',
  '[
    {
      "id": 1,
      "title": "1. Penimbangan Bahan Kering & Basah",
      "duration": 30,
      "summary": "Timbang mentega, gula halus, tepung terigu, dan chocochips sesuai takaran menggunakan timbangan bersuara.",
      "audioDescription": "Instruktur menimbang mangkuk mentega di atas timbangan digital dengan display kontras tinggi.",
      "materials": ["Mentega 200 gram", "Gula halus 100 gram", "Tepung terigu 250 gram", "Chocochips 100 gram"],
      "subtitles": [
        {"start": 0, "end": 10, "text": "Kunci keberhasilan kue kering adalah takaran bahan yang tepat dan akurat."},
        {"start": 10, "end": 20, "text": "Gunakan mangkuk terpisah untuk bahan basah dan bahan kering."},
        {"start": 20, "end": 30, "text": "Pastikan mentega berada pada suhu ruang sebelum diaduk."}
      ]
    },
    {
      "id": 2,
      "title": "2. Pengadukan Adonan Merata",
      "duration": 40,
      "summary": "Campur mentega dan gula hingga lembut pucat, masukkan tepung terigu perlahan hingga kalis.",
      "audioDescription": "Spatula mengaduk mentega dan gula menjadi krim lembut bertekstur halus.",
      "materials": ["Wadah baskom pengaduk", "Spatula silikon", "Saringan tepung halus"],
      "subtitles": [
        {"start": 0, "end": 15, "text": "Kocok mentega dan gula hingga warnanya berubah lebih pucat dan lembut."},
        {"start": 15, "end": 28, "text": "Tambahkan tepung terigu dan bubuk cokelat secara bertahap."},
        {"start": 28, "end": 40, "text": "Aduk adonan hingga kalis dan mudah dibentuk dengan tangan."}
      ]
    },
    {
      "id": 3,
      "title": "3. Mencetak dan Memanggang",
      "duration": 45,
      "summary": "Bentuk bulatan kecil adonan di atas loyang, beri hiasan chocochips, dan panggang pada oven bersuhu 150 derajat.",
      "audioDescription": "Loyang berisi bulatan adonan kue cokelat dimasukkan ke dalam rak oven listrik.",
      "materials": ["Loyang panggangan berlapis kertas roti", "Chocochips hiasan", "Sarung tangan oven anti-panas"],
      "subtitles": [
        {"start": 0, "end": 15, "text": "Bentuk adonan menjadi bulatan rata dan susun di loyang dengan jarak teratur."},
        {"start": 15, "end": 30, "text": "Tekan sedikit bagian atasnya dan letakkan butiran chocochips sebagai pemanis."},
        {"start": 30, "end": 45, "text": "Panggang selama 20 hingga 25 menit sampai aroma kue cokelat harum matang."}
      ]
    },
    {
      "id": 4,
      "title": "4. Pengemasan Toples Kedap Udara",
      "duration": 35,
      "summary": "Dinginkan kue kering, susun rapi ke dalam toples bening, rekatkan segel pengaman dan stiker harga.",
      "audioDescription": "Kue kering cokelat yang telah dingin dimasukkan satu per satu ke toples plastik dengan penutup rapat.",
      "materials": ["Toples plastik tebal 500 gram", "Solasi segel higienis", "Stiker label nama toko"],
      "subtitles": [
        {"start": 0, "end": 12, "text": "Pastikan kue sudah benar-benar dingin sebelum dimasukkan ke dalam toples."},
        {"start": 12, "end": 24, "text": "Tutup rapat toples dan beri segel pengaman agar kue tetap renyah tahan lama."},
        {"start": 24, "end": 35, "text": "Kue kering cokelat lezat siap dijual kepada pelanggan setia tokomu."}
      ]
    }
  ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 8. Seed Data Awal: Modul Kriya Tatakan Gelas Anyaman
INSERT INTO courses (id, title, category, duration_text, default_modal, default_price, description, steps)
VALUES (
  'anyaman-kriya',
  'Kerajinan Kriya: Tatakan Gelas Anyaman',
  'Kriya Tradisional',
  '4 Langkah • 20 Menit',
  10000,
  25000,
  'Pelatihan seni merangkai serat alami menjadi tatakan gelas dan taplak meja mini yang bernilai estetika tinggi.',
  '[
    {
      "id": 1,
      "title": "1. Pemilihan Serat dan Tali Rami",
      "duration": 30,
      "summary": "Pilih serat rami atau enceng gondok yang bersih, lentur, dan bebas jamur untuk bahan anyaman.",
      "audioDescription": "Gulungan tali rami cokelat muda dan cetakan bundar diletakkan di atas meja anyam.",
      "materials": ["Tali rami alami 10 meter", "Pola lingkaran karton", "Gunting potong serat"],
      "subtitles": [
        {"start": 0, "end": 10, "text": "Kerajinan anyaman serat alami memiliki nilai jual tinggi dan diminati banyak kafe."},
        {"start": 10, "end": 20, "text": "Siapkan tali rami lentur berukuran sedang sebagai bahan anyaman utama."},
        {"start": 20, "end": 30, "text": "Gunakan alas karton lingkaran sebagai panduan ukuran tatakan gelas."}
      ]
    },
    {
      "id": 2,
      "title": "2. Memulai Anyaman Pola Spiral",
      "duration": 35,
      "summary": "Gulung tali membentuk spiral kecil sebagai titik tengah tatakan, eratkan sambungan dengan lem tembak.",
      "audioDescription": "Tangan instruktur memutar tali secara melingkar konsentris dan merekatkan setiap putaran dengan lem.",
      "materials": ["Alat lem tembak / perekat serat", "Penjepit kayu penahan putaran"],
      "subtitles": [
        {"start": 0, "end": 12, "text": "Bentuk simpul lingkaran rapat di bagian tengah sebagai pusat anyaman."},
        {"start": 12, "end": 25, "text": "Putar tali mengikuti arah melingkar spiral secara perlahan dan rapat."},
        {"start": 25, "end": 35, "text": "Rekatkan setiap baris tali dengan lem tembak agar anyaman kokoh dan padat."}
      ]
    },
    {
      "id": 3,
      "title": "3. Merapikan Anyaman dan Pinggiran",
      "duration": 40,
      "summary": "Lanjutkan putaran hingga diameter 12 cm, kunci ujung tali rami di sisi belakang tatakan.",
      "audioDescription": "Anyaman lingkaran diperiksa kerapatannya, ujung tali dipotong serong dan diselipkan ke bagian bawah.",
      "materials": ["Gunting benang", "Kuas pernis pelindung serat"],
      "subtitles": [
        {"start": 0, "end": 15, "text": "Lanjutkan putaran sampai tatakan mencapai ukuran standar tatakan gelas."},
        {"start": 15, "end": 28, "text": "Potong ujung tali secara rapi dan selipkan di bagian bawah tatakan."},
        {"start": 28, "end": 40, "text": "Lapisi permukaan dengan pelindung serat alami agar tahan terhadap tetesan air."}
      ]
    },
    {
      "id": 4,
      "title": "4. Pengikatan Paket dan Label Produk",
      "duration": 30,
      "summary": "Ikat empat buah tatakan gelas menjadi satu set menggunakan pita kertas dan label kriya mandiri.",
      "audioDescription": "Empat tatakan anyaman ditumpuk rapi dan diikat dengan pita kertas cokelat bertuliskan SENSORIA Craft.",
      "materials": ["Pita kertas pengikat paket", "Label produk buatan tangan"],
      "subtitles": [
        {"start": 0, "end": 10, "text": "Produk anyaman lebih laku dijual dalam bentuk satu paket berisi empat tatakan."},
        {"start": 10, "end": 20, "text": "Satukan tumpukan tatakan dengan pita kertas sederhana yang estetik."},
        {"start": 20, "end": 30, "text": "Tatakan anyaman serat alami siap dipajang di etalase dan dijual ke konsumen."}
      ]
    }
  ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 9. Seed Data Siswa Binaan
INSERT INTO students (id, name, sensory_profile, profile_label, school, progress_summary, last_active)
VALUES
  ('std-001', 'Budi Santoso', 'netra', 'Tunanetra (Mode Suara)', 'SLB Negeri 1 Pembina', 'Menyelesaikan 3 langkah Lilin Aromaterapi', 'Hari ini'),
  ('std-002', 'Siti Rahmawati', 'kurang_awas', 'Kurang Awas (Kontras Tinggi & Font Besar)', 'SLB B-C Inklusif', 'Menyelesaikan modul Sabun Herbal & Kalkulator Untung', 'Kemarin'),
  ('std-003', 'Dimas Anggoro', 'rungu', 'Tunarungu (Takarir CC & Video JBI)', 'Sekolah Vokasi Mandiri', 'Sedang mempelajari Tata Boga Kue Kering', '2 hari lalu'),
  ('std-004', 'Aisyah Putri', 'wicara', 'Tunawicara (Navigasi Sentuh Murni)', 'SLB Harapan Bangsa', 'Menyelesaikan Tatakan Gelas Anyaman', '3 hari lalu')
ON CONFLICT (id) DO NOTHING;

-- 8. Seed Master Biaya Bahan Baku
INSERT INTO materials (id, name, unit, cost, category)
VALUES
  ('mat-1', 'Lilin Kedelai (Soy Wax) 1 kg', 'kg', 45000, 'Lilin'),
  ('mat-2', 'Minyak Esensial Lavender 10 ml', 'botol', 18000, 'Lilin'),
  ('mat-3', 'Sumbu Katun Alami (10 pcs)', 'pack', 5000, 'Lilin'),
  ('mat-4', 'Toples Kaca Kedap Udara 150ml', 'buah', 4000, 'Wadah'),
  ('mat-5', 'Basis Sabun Gliserin Nabati 1 kg', 'kg', 38000, 'Sabun'),
  ('mat-6', 'Tepung Terigu Protein Rendah 1 kg', 'kg', 14000, 'Tata Boga'),
  ('mat-7', 'Tali Rami Alami Roll 50m', 'roll', 20000, 'Anyaman')
ON CONFLICT (id) DO NOTHING;
