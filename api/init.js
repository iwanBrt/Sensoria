import { getDb, isDbConfigured } from './db.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!isDbConfigured()) {
    return res.status(200).json({
      success: false,
      connected: false,
      message: 'Vercel Postgres URL belum terdeteksi. Silakan hubungkan Postgres di Vercel Dashboard -> Storage.',
    });
  }

  try {
    const sql = getDb();

    // 1. Create tables
    await sql`
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
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        sensory_profile TEXT NOT NULL,
        profile_label TEXT,
        school TEXT,
        progress_summary TEXT,
        last_active TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS materials (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        unit TEXT NOT NULL,
        cost NUMERIC NOT NULL,
        category TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // 2. Seed default courses if not present
    await sql`
      INSERT INTO courses (id, title, category, duration_text, default_modal, default_price, description, steps)
      VALUES 
      (
        'lilin-aromaterapi',
        'Pembuatan Lilin Aromaterapi Lavender',
        'Kriya & Kerajinan',
        '4 Langkah • 15 Menit',
        15000,
        35000,
        'Keterampilan membuat lilin kedelai ramah lingkungan dengan wangi minyak aromaterapi yang menenangkan.',
        '[
          {"id": 1, "title": "1. Persiapan Alat dan Bahan Baku", "duration": 35, "summary": "Siapkan serpihan lilin kedelai (soy wax), wadah toples kaca tahan panas, sumbu katun bebas timbal, dan minyak esensial lavender.", "audioDescription": "Instruktur meletakkan toples kaca, mangkuk lilin kedelai, dan botol lavender di atas meja.", "materials": ["Serpihan Lilin Kedelai 200 gram", "Sumbu Katun", "Minyak Lavender 10 ml", "Toples Kaca Tahan Panas"], "subtitles": [{"start": 0, "end": 10, "text": "Selamat datang di kelas vokasi SENSORIA. Hari ini kita belajar membuat lilin aromaterapi."}, {"start": 10, "end": 22, "text": "Lilin kedelai alami sangat aman bagi kesehatan dan ramah lingkungan."}, {"start": 22, "end": 35, "text": "Pastikan semua bahan sudah tersusun rapi di atas meja sebelum mulai."}]},
          {"id": 2, "title": "2. Pelelehan Lilin Kedelai", "duration": 40, "summary": "Panaskan mangkuk lilin di atas panci air panas dengan teknik pemanasan tidak langsung hingga mencair merata.", "audioDescription": "Serpihan lilin mencair merata terkena uap air mendidih.", "materials": ["Panci pemanas air", "Mangkuk lilin tahan panas", "Sendok pengaduk kayu"], "subtitles": [{"start": 0, "end": 12, "text": "Panaskan mangkuk berisi lilin di atas panci air hangat secara perlahan."}, {"start": 12, "end": 26, "text": "Aduk perlahan menggunakan sendok kayu hingga seluruh butiran lilin mencair."}, {"start": 26, "end": 40, "text": "Setelah mencair sempurna, matikan kompor dan biarkan suhu lilin menurun sejenak."}]},
          {"id": 3, "title": "3. Pencampuran Aroma dan Penuangan", "duration": 45, "summary": "Teteskan minyak lavender saat lilin hangat kuku. Pasang sumbu di tengah toples, lalu tuang lilin perlahan hingga penuh.", "audioDescription": "Minyak aromaterapi diteteskan ke lilin cair dan dituangkan ke toples berpenyangga sumbu.", "materials": ["Minyak esensial lavender", "Penjepit kayu penyangga", "Lap pembersih"], "subtitles": [{"start": 0, "end": 14, "text": "Teteskan minyak esensial ketika lilin hangat agar aroma wangi tidak cepat menguap."}, {"start": 14, "end": 28, "text": "Posisikan sumbu lilin tepat di tengah toples menggunakan bantuan penjepit kayu."}, {"start": 28, "end": 45, "text": "Tuang lilin cair ke toples secara perlahan dan biarkan memadat selama 3 jam."}]},
          {"id": 4, "title": "4. Penyempurnaan Sumbu dan Pelabelan", "duration": 35, "summary": "Gunting sumbu hingga tersisa sekitar setengah sentimeter. Tempelkan label nama usahamu pada toples kaca.", "audioDescription": "Lilin telah memadat putih pekat. Instruktur merapikan sumbu dan menempelkan stiker produk.", "materials": ["Gunting tajam", "Stiker label merek", "Kemasan karton"], "subtitles": [{"start": 0, "end": 12, "text": "Setelah lilin memadat sepenuhnya, potong kelebihan sumbu dengan gunting."}, {"start": 12, "end": 24, "text": "Tempelkan stiker label usahamu dengan rapi pada permukaan toples."}, {"start": 24, "end": 35, "text": "Produk lilin aromaterapimu telah siap dipasarkan. Sekarang mari hitung keuntungannya."}]}
        ]'::jsonb
      ),
      (
        'sabun-organik',
        'Pembuatan Sabun Cuci Tangan Herbal',
        'Kriya & Sanitasi',
        '4 Langkah • 20 Menit',
        12000,
        28000,
        'Keterampilan memproduksi sabun pembersih berbahan dasar minyak kelapa dan lidah buaya yang lembut di kulit.',
        '[
          {"id": 1, "title": "1. Menyiapkan Bahan Dasar Sabun", "duration": 30, "summary": "Siapkan basis sabun gliserin transparan, ekstrak lidah buaya, cetakan silikon, dan pewangi alami.", "audioDescription": "Potongan bahan sabun kubus kecil tertata rapi di samping cetakan silikon biru.", "materials": ["Sabun gliserin nabati 250 gram", "Gel lidah buaya segar 20 ml", "Cetakan sabun silikon"], "subtitles": [{"start": 0, "end": 10, "text": "Selamat datang di kelas pembuatan sabun herbal mandiri."}, {"start": 10, "end": 20, "text": "Kita menggunakan bahan sabun gliserin alami yang sangat aman diproses."}, {"start": 20, "end": 30, "text": "Potong bahan sabun menjadi dadu kecil agar cepat mencair saat dipanaskan."}]}
        ]'::jsonb
      ),
      (
        'kue-kering',
        'Tata Boga: Produksi Kue Kering Chocochips',
        'Kuliner & Tata Boga',
        '4 Langkah • 25 Menit',
        20000,
        45000,
        'Pelatihan membuat kue kering cokelat renyah dengan takaran presisi dan teknik pengemasan toples kedap udara.',
        '[
          {"id": 1, "title": "1. Penimbangan Bahan Kering & Basah", "duration": 30, "summary": "Timbang mentega, gula halus, tepung terigu, dan chocochips sesuai takaran menggunakan timbangan bersuara.", "audioDescription": "Instruktur menimbang mangkuk mentega di atas timbangan digital kontras tinggi.", "materials": ["Mentega 200 gram", "Gula halus 100 gram", "Tepung terigu 250 gram", "Chocochips 100 gram"], "subtitles": [{"start": 0, "end": 10, "text": "Kunci keberhasilan kue kering adalah takaran bahan yang tepat dan akurat."}, {"start": 10, "end": 20, "text": "Gunakan mangkuk terpisah untuk bahan basah dan bahan kering."}, {"start": 20, "end": 30, "text": "Pastikan mentega berada pada suhu ruang sebelum diaduk."}]}
        ]'::jsonb
      ),
      (
        'anyaman-kriya',
        'Kerajinan Kriya: Tatakan Gelas Anyaman',
        'Kriya Tradisional',
        '4 Langkah • 20 Menit',
        10000,
        25000,
        'Pelatihan seni merangkai serat alami menjadi tatakan gelas dan taplak meja mini yang bernilai estetika tinggi.',
        '[
          {"id": 1, "title": "1. Pemilihan Serat dan Tali Rami", "duration": 30, "summary": "Pilih serat rami atau enceng gondok yang bersih, lentur, dan bebas jamur untuk bahan anyaman.", "audioDescription": "Gulungan tali rami cokelat muda dan cetakan bundar diletakkan di atas meja.", "materials": ["Tali rami alami 10 meter", "Pola lingkaran karton", "Gunting serat"], "subtitles": [{"start": 0, "end": 10, "text": "Kerajinan anyaman serat alami memiliki nilai jual tinggi dan diminati banyak kafe."}, {"start": 10, "end": 20, "text": "Siapkan tali rami lentur berukuran sedang sebagai bahan anyaman utama."}, {"start": 20, "end": 30, "text": "Gunakan alas karton lingkaran sebagai panduan ukuran tatakan gelas."}]}
        ]'::jsonb
      )
      ON CONFLICT (id) DO NOTHING;
    `;

    // 3. Seed default students
    await sql`
      INSERT INTO students (id, name, sensory_profile, profile_label, school, progress_summary, last_active)
      VALUES
        ('std-001', 'Budi Santoso', 'netra', 'Tunanetra (Mode Suara)', 'SLB Negeri 1 Pembina', 'Menyelesaikan 3 langkah Lilin Aromaterapi', 'Hari ini'),
        ('std-002', 'Siti Rahmawati', 'kurang_awas', 'Kurang Awas (Kontras Tinggi & Font Besar)', 'SLB B-C Inklusif', 'Menyelesaikan modul Sabun Herbal & Kalkulator Untung', 'Kemarin'),
        ('std-003', 'Dimas Anggoro', 'rungu', 'Tunarungu (Takarir CC & Video JBI)', 'Sekolah Vokasi Mandiri', 'Sedang mempelajari Tata Boga Kue Kering', '2 hari lalu'),
        ('std-004', 'Aisyah Putri', 'wicara', 'Tunawicara (Navigasi Sentuh Murni)', 'SLB Harapan Bangsa', 'Menyelesaikan Tatakan Gelas Anyaman', '3 hari lalu')
      ON CONFLICT (id) DO NOTHING;
    `;

    // 4. Seed default materials
    await sql`
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
    `;

    return res.status(200).json({
      success: true,
      connected: true,
      message: 'Tabel database Vercel Postgres (courses, students, materials) berhasil dibuat dan diisi data awal!',
    });
  } catch (error) {
    console.error('Error initializing Vercel Postgres:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
