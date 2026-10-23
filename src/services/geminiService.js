// Service integrasi Google Gemini AI untuk SENSORIA
// Model: gemini-3.5-flash (High Performance, Cepat, dan Hemat Kuota)

const GEMINI_API_KEY = import.meta.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_MODEL = 'gemini-3.5-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

export const geminiService = {
  // Cek apakah API Key Gemini tersedia
  isConfigured() {
    return Boolean(GEMINI_API_KEY && GEMINI_API_KEY.length > 10);
  },

  // 1. Dapatkan Saran Harga Jual 3-Tier (Murah, Standar, Premium) dari AI Gemini
  async getPricingRecommendation({
    productName,
    hppPerUnit,
    totalCost,
    batchUnits,
    materials = [],
  }) {
    // Fallback matematis instan jika API Key belum dipasang / offline
    const fallbackTiers = {
      cheap: {
        tierName: 'Harga Murah (Penetrasi)',
        price: Math.ceil((hppPerUnit * 1.2) / 500) * 500, // Margin 20%
        marginPercent: 20,
        profitPerUnit: Math.ceil((hppPerUnit * 1.2) / 500) * 500 - hppPerUnit,
        targetAudience: 'Teman sekolah, tetangga, atau bazar kilat',
        strategy: 'Cocok untuk perkenalan produk agar cepat laku dan modal cepat berputar.',
      },
      standard: {
        tierName: 'Harga Standar (Wajar & Ideal)',
        price: Math.ceil((hppPerUnit * 1.4) / 500) * 500, // Margin 40%
        marginPercent: 40,
        profitPerUnit: Math.ceil((hppPerUnit * 1.4) / 500) * 500 - hppPerUnit,
        targetAudience: 'Konsumen umum, titip di kantin/koperasi, atau toko online',
        strategy: 'Memberikan keuntungan yang sehat untuk ditabung dan modal produksi berikutnya.',
      },
      premium: {
        tierName: 'Harga Premium (Edisi Hadiah)',
        price: Math.ceil((hppPerUnit * 1.7) / 500) * 500, // Margin 70%
        marginPercent: 70,
        profitPerUnit: Math.ceil((hppPerUnit * 1.7) / 500) * 500 - hppPerUnit,
        targetAudience: 'Hampers kado, cinderamata acara khusus, atau pemesanan custom',
        strategy: 'Sertakan kemasan cantik dengan pita, kartu ucapan buatan sendiri, dan garansi kualitas.',
      },
      aiNote: 'Harga dihitung otomatis berdasarkan formula HPP modal produksi per unit.',
    };

    if (!this.isConfigured()) {
      return fallbackTiers;
    }

    try {
      const prompt = `
Kamu adalah konsultan bisnis dan wirausaha ramah untuk siswa vokasi SLB (Sekolah Luar Biasa) Tunarungu dan Tunawicara di aplikasi SENSORIA.
Siswa sedang menghitung harga jual untuk karya mandirinya:
- Nama Produk: ${productName}
- Total Modal Produksi: Rp ${totalCost.toLocaleString('id-ID')}
- Jumlah Unit Dihasilkan: ${batchUnits} pcs
- HPP (Harga Pokok Penjualan per unit): Rp ${hppPerUnit.toLocaleString('id-ID')}
- Bahan & Biaya yang digunakan: ${materials.map((m) => `${m.name} (${m.cost})`).join(', ')}

Tugasmu:
Buatlah rekomendasi harga jual dalam 3 kategori:
1. "cheap" (Harga Murah / Penetrasi Pasar, margin sekitar 15-25%)
2. "standard" (Harga Standar / Wajar, margin sekitar 30-45%)
3. "premium" (Harga Premium / Hampers Hadiah, margin sekitar 50-75%)

Bulatkan setiap harga ke kelipatan Rp 500 atau Rp 1.000 terdekat agar mudah bertransaksi tunai.
Jawab HANYA dalam format JSON murni tanpa markdown kutip backtick, dengan struktur:
{
  "cheap": {
    "tierName": "Harga Murah (Penetrasi)",
    "price": <angka integer harga jual>,
    "marginPercent": <angka integer persen margin>,
    "profitPerUnit": <angka integer keuntungan per unit>,
    "targetAudience": "<target pembeli singkat>",
    "strategy": "<1-2 kalimat strategi penjualan>"
  },
  "standard": {
    "tierName": "Harga Standar (Wajar)",
    "price": <angka integer harga jual>,
    "marginPercent": <angka integer persen margin>,
    "profitPerUnit": <angka integer keuntungan per unit>,
    "targetAudience": "<target pembeli singkat>",
    "strategy": "<1-2 kalimat strategi penjualan>"
  },
  "premium": {
    "tierName": "Harga Premium (Edisi Hadiah)",
    "price": <angka integer harga jual>,
    "marginPercent": <angka integer persen margin>,
    "profitPerUnit": <angka integer keuntungan per unit>,
    "targetAudience": "<target pembeli singkat>",
    "strategy": "<1-2 kalimat strategi nilai tambah>"
  },
  "aiNote": "<1 kalimat motivasi singkat yang menyemangati siswa>"
}
`;

      const response = await fetch(GEMINI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1000,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        cheap: parsed.cheap || fallbackTiers.cheap,
        standard: parsed.standard || fallbackTiers.standard,
        premium: parsed.premium || fallbackTiers.premium,
        aiNote: parsed.aiNote || fallbackTiers.aiNote,
      };
    } catch (err) {
      console.warn('Gagal memanggil Gemini Pricing AI, beralih ke formula lokal:', err);
      return fallbackTiers;
    }
  },

  // 2. Analisis Hasil Penjualan & Berikan Solusi Praktis dari AI Gemini ("Sensoria Sales Coach")
  async analyzeSalesResults({
    productName,
    totalProduced,
    totalSold,
    sellingPrice,
    totalModal,
    salesDuration,
    challenges = [],
    notes = '',
  }) {
    const revenue = totalSold * sellingPrice;
    const netProfit = revenue - totalModal;
    const remainingUnits = Math.max(0, totalProduced - totalSold);
    const soldPercentage = totalProduced > 0 ? Math.round((totalSold / totalProduced) * 100) : 0;
    const isBreakEven = revenue >= totalModal;

    // Fallback jika API tidak tersedia
    const fallbackAnalysis = {
      isBreakEven,
      soldPercentage,
      revenue,
      netProfit,
      diagnosis:
        soldPercentage >= 70
          ? 'Penjualanmu sudah sangat baik! Mayoritas produk berhasil terjual.'
          : 'Penjualan masih bisa ditingkatkan karena sisa produk masih cukup banyak.',
      recommendations: [
        'Coba buat foto produk di dekat jendela dengan cahaya terang dan pasang di status WhatsApp.',
        'Tawarkan paket hemat beli 2 produk dengan bonus stiker nama tokomu.',
        'Ajak teman atau keluarga untuk mencoba tester gratis agar mereka memberi rekomendasi ke orang lain.',
      ],
      motivation:
        'Tetap semangat berkarya! Setiap pengusaha hebat berawal dari proses belajar dan mencoba hal baru.',
    };

    if (!this.isConfigured()) {
      return fallbackAnalysis;
    }

    try {
      const prompt = `
Kamu adalah "Sensoria Coach", mentor bisnis yang sangat suportif, hangat, dan ramah untuk siswa vokasi SLB (Tunarungu dan Tunawicara).
Siswa telah selesai mencoba menjual produk karyanya dan mencatatkan data penjualan berikut:
- Nama Produk: ${productName}
- Modal Awal Produksi: Rp ${totalModal.toLocaleString('id-ID')}
- Jumlah Dibuat: ${totalProduced} pcs
- Jumlah Terjual: ${totalSold} pcs (${soldPercentage}%)
- Sisa Belum Terjual: ${remainingUnits} pcs
- Harga Jual per Pcs: Rp ${sellingPrice.toLocaleString('id-ID')}
- Total Pemasukan: Rp ${revenue.toLocaleString('id-ID')}
- Hasil Bersih: ${netProfit >= 0 ? `Untung Rp ${netProfit.toLocaleString('id-ID')}` : `Kurang Rp ${Math.abs(netProfit).toLocaleString('id-ID')} untuk balik modal`}
- Durasi Jualan: ${salesDuration || 'Beberapa hari'}
- Kendala yang dirasakan siswa: ${challenges.length > 0 ? challenges.join(', ') : 'Belum spesifik'}
- Catatan Tambahan Siswa: ${notes || '-'}

Tugasmu:
Lakukan analisis penjualan dan berikan saran solusi praktis. Ingat, siswa adalah tunarungu/tunawicara, jadi gunakan bahasa Indonesia yang sederhana, visual, ramah jempol, tidak bertele-tele, dan penuh semangat!

Jawab HANYA dalam format JSON murni tanpa kutip backtick, dengan struktur:
{
  "performanceLevel": "<Pilihan: 'hebat' | 'cukup' | 'perlu_evaluasi'>",
  "diagnosis": "<2-3 kalimat penjelasan mengapa hasil penjualannya seperti ini berdasarkan kendala yang dihadapi>",
  "recommendations": [
    "<Saran langkah 1: trik promosi visual/non-verbal>",
    "<Saran langkah 2: trik harga, tester, atau kemasan>",
    "<Saran langkah 3: cara memasarkan ke lingkungan sekitar>"
  ],
  "motivation": "<1-2 kalimat penyemangat yang menyentuh hati dan membuat siswa bangga atas usahanya>"
}
`;

      const response = await fetch(GEMINI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1000,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        isBreakEven,
        soldPercentage,
        revenue,
        netProfit,
        performanceLevel: parsed.performanceLevel || (isBreakEven ? 'hebat' : 'perlu_evaluasi'),
        diagnosis: parsed.diagnosis || fallbackAnalysis.diagnosis,
        recommendations: parsed.recommendations || fallbackAnalysis.recommendations,
        motivation: parsed.motivation || fallbackAnalysis.motivation,
      };
    } catch (err) {
      console.warn('Gagal memanggil Gemini Sales Coach AI, gunakan analisis cerdas lokal:', err);
      return fallbackAnalysis;
    }
  },
};
