// Master Data Pilihan Bahan Baku, Kemasan, dan Operasional untuk Kalkulator HPP SENSORIA
// Siswa dapat memilih dari dropdown atau mengetik nama & biaya sendiri

export const MATERIAL_CATEGORIES = [
  {
    category: 'Tata Boga & Kuliner',
    items: [
      { name: 'Tepung Terigu Protein Rendah', defaultUnit: 'kg', estimatedCost: 14000 },
      { name: 'Gula Pasir / Gula Halus', defaultUnit: 'kg', estimatedCost: 18000 },
      { name: 'Mentega / Margarin Berkualitas', defaultUnit: 'pack (200gr)', estimatedCost: 12000 },
      { name: 'Cokelat Bubuk Murni', defaultUnit: 'pack (100gr)', estimatedCost: 16000 },
      { name: 'Butiran Chocochips', defaultUnit: 'pack (250gr)', estimatedCost: 22000 },
      { name: 'Telur Ayam Segar', defaultUnit: 'kg (16 butir)', estimatedCost: 28000 },
      { name: 'Susu Bubuk / Cair', defaultUnit: 'kotak (250ml)', estimatedCost: 8000 },
      { name: 'Minyak Goreng Sawit/Kelapa', defaultUnit: 'liter', estimatedCost: 17000 },
      { name: 'Keju Cheddar Parut', defaultUnit: 'batang (160gr)', estimatedCost: 15000 },
      { name: 'Vanili & Garam Perasa', defaultUnit: 'botol kecil', estimatedCost: 5000 },
      { name: 'Baking Powder / Ragi Pengembang', defaultUnit: 'sachet', estimatedCost: 4000 },
    ],
  },
  {
    category: 'Kriya Lilin Aromaterapi',
    items: [
      { name: 'Serpihan Lilin Kedelai (Soy Wax)', defaultUnit: 'kg', estimatedCost: 45000 },
      { name: 'Minyak Esensial Lavender Alami', defaultUnit: 'botol (10ml)', estimatedCost: 18000 },
      { name: 'Minyak Esensial Jeruk / Vanila', defaultUnit: 'botol (10ml)', estimatedCost: 17000 },
      { name: 'Sumbu Katun dengan Penyangga Logam', defaultUnit: 'pack (10 pcs)', estimatedCost: 6000 },
      { name: 'Pewarna Lilin Ramah Lingkungan', defaultUnit: 'botol kecil', estimatedCost: 8000 },
      { name: 'Penjepit Kayu Penyangga Sumbu', defaultUnit: 'pack (5 pcs)', estimatedCost: 4000 },
    ],
  },
  {
    category: 'Kriya Sabun Herbal & Sanitasi',
    items: [
      { name: 'Basis Sabun Gliserin Nabati (Melt & Pour)', defaultUnit: 'kg', estimatedCost: 38000 },
      { name: 'Gel Lidah Buaya Segar / Ekstrak', defaultUnit: 'botol (100ml)', estimatedCost: 12000 },
      { name: 'Minyak Kelapa Murni (VCO)', defaultUnit: 'botol (100ml)', estimatedCost: 15000 },
      { name: 'Pewangi Alami Lemon / Serai', defaultUnit: 'botol (10ml)', estimatedCost: 10000 },
      { name: 'Pewarna Alami Daun Suji / Kunyit', defaultUnit: 'botol kecil', estimatedCost: 5000 },
      { name: 'Alkohol Semprot Steril 70%', defaultUnit: 'botol (100ml)', estimatedCost: 7000 },
    ],
  },
  {
    category: 'Kriya Tradisional & Anyaman',
    items: [
      { name: 'Tali Rami Alami Roll (Goni)', defaultUnit: 'roll (50 meter)', estimatedCost: 20000 },
      { name: 'Serat Enceng Gondok Olahan', defaultUnit: 'ikat', estimatedCost: 15000 },
      { name: 'Isi Lem Tembak (Glue Gun Refill)', defaultUnit: 'pack (10 batang)', estimatedCost: 8000 },
      { name: 'Pernis Pelindung Serat Kayu/Rami', defaultUnit: 'kaleng kecil', estimatedCost: 16000 },
      { name: 'Kain Furing / Alas Tatakan', defaultUnit: 'meter', estimatedCost: 10000 },
    ],
  },
  {
    category: 'Kemasan, Wadah, & Label Merek',
    items: [
      { name: 'Toples Kaca Kedap Udara 150ml', defaultUnit: 'pcs', estimatedCost: 4500 },
      { name: 'Toples Plastik Mika Bening 250gr', defaultUnit: 'pcs', estimatedCost: 3000 },
      { name: 'Toples Plastik Mika Tebal 500gr', defaultUnit: 'pcs', estimatedCost: 4000 },
      { name: 'Botol Sabun Pompa (Pump) 250ml', defaultUnit: 'pcs', estimatedCost: 4000 },
      { name: 'Kertas Cokelat Samson Daur Ulang', defaultUnit: 'lembar besar', estimatedCost: 2500 },
      { name: 'Pita Kertas & Tali Rami Pemanis', defaultUnit: 'roll (10 meter)', estimatedCost: 5000 },
      { name: 'Stiker Label Merek Usaha Tahan Air', defaultUnit: 'lembar (isi 24 pcs)', estimatedCost: 10000 },
      { name: 'Kotak Kardus Kraft / Box Hampers', defaultUnit: 'pcs', estimatedCost: 5000 },
      { name: 'Plastik Pembungkus Higienis / Seal', defaultUnit: 'pack (50 pcs)', estimatedCost: 7000 },
    ],
  },
  {
    category: 'Biaya Operasional & Energi',
    items: [
      { name: 'Gas LPG Oven / Kompor (Estimasi Pemakaian)', defaultUnit: 'per batch produksi', estimatedCost: 6000 },
      { name: 'Listrik & Air Bersih', defaultUnit: 'per batch produksi', estimatedCost: 5000 },
      { name: 'Ongkos Kirim / Belanja Bahan Baku', defaultUnit: 'per transaksi', estimatedCost: 10000 },
      { name: 'Sarung Tangan Higienis / Plastik', defaultUnit: 'pasang', estimatedCost: 2000 },
      { name: 'Biaya Promosi Pulsa / Kuota Internet', defaultUnit: 'per minggu', estimatedCost: 10000 },
    ],
  },
];

// Flat list nama bahan untuk autocomplete / pencarian cepat
export const ALL_MATERIAL_NAMES = MATERIAL_CATEGORIES.flatMap((c) =>
  c.items.map((item) => ({ ...item, category: c.category }))
);

// TEMPLATE BAWAAN AWAL YANG BISA DIEDIT & DITAMBAH OLEH SISWA/GURU
export const INITIAL_HPP_TEMPLATES = [
  {
    id: 'tpl-lilin-lavender',
    name: 'Lilin Aromaterapi Lavender (Toples Kaca)',
    category: 'Kriya Lilin',
    batchUnits: 5,
    unitName: 'toples',
    items: [
      { id: '1', name: 'Serpihan Lilin Kedelai (Soy Wax)', quantity: '500 gram', cost: 23000 },
      { id: '2', name: 'Minyak Esensial Lavender Alami', quantity: '1 botol (10ml)', cost: 18000 },
      { id: '3', name: 'Sumbu Katun dengan Penyangga Logam', quantity: '5 pcs', cost: 3000 },
      { id: '4', name: 'Toples Kaca Kedap Udara 150ml', quantity: '5 pcs', cost: 22500 },
      { id: '5', name: 'Stiker Label Merek Usaha Tahan Air', quantity: '5 pcs', cost: 2500 },
      { id: '6', name: 'Listrik & Air Bersih', quantity: '1 kali masak', cost: 4000 },
    ],
    defaultMarginPercent: 40,
  },
  {
    id: 'tpl-sabun-herbal',
    name: 'Sabun Cuci Tangan Herbal Lidah Buaya',
    category: 'Kriya Sabun',
    batchUnits: 10,
    unitName: 'batang',
    items: [
      { id: '1', name: 'Basis Sabun Gliserin Nabati (Melt & Pour)', quantity: '1 kg', cost: 38000 },
      { id: '2', name: 'Gel Lidah Buaya Segar / Ekstrak', quantity: '50 ml', cost: 8000 },
      { id: '3', name: 'Pewangi Alami Lemon / Serai', quantity: '1 botol', cost: 10000 },
      { id: '4', name: 'Kertas Cokelat Samson Daur Ulang', quantity: '2 lembar', cost: 5000 },
      { id: '5', name: 'Stiker Label Merek Usaha Tahan Air', quantity: '10 pcs', cost: 4000 },
      { id: '6', name: 'Pita Kertas & Tali Rami Pemanis', quantity: '1 roll', cost: 5000 },
    ],
    defaultMarginPercent: 35,
  },
  {
    id: 'tpl-kue-chocochips',
    name: 'Kue Kering Cokelat Chocochips Renyah',
    category: 'Tata Boga & Kuliner',
    batchUnits: 6,
    unitName: 'toples (250gr)',
    items: [
      { id: '1', name: 'Tepung Terigu Protein Rendah', quantity: '750 gram', cost: 11000 },
      { id: '2', name: 'Mentega / Margarin Berkualitas', quantity: '2 pack', cost: 24000 },
      { id: '3', name: 'Gula Pasir / Gula Halus', quantity: '300 gram', cost: 6000 },
      { id: '4', name: 'Cokelat Bubuk Murni', quantity: '100 gram', cost: 16000 },
      { id: '5', name: 'Butiran Chocochips', quantity: '150 gram', cost: 14000 },
      { id: '6', name: 'Toples Plastik Mika Bening 250gr', quantity: '6 pcs', cost: 18000 },
      { id: '7', name: 'Gas LPG Oven / Kompor (Estimasi Pemakaian)', quantity: '1 kali panggang', cost: 6000 },
      { id: '8', name: 'Stiker Label Merek Usaha Tahan Air', quantity: '6 pcs', cost: 3000 },
    ],
    defaultMarginPercent: 40,
  },
  {
    id: 'tpl-anyaman-tatakan',
    name: 'Set Tatakan Gelas Anyaman Tali Rami',
    category: 'Kriya Tradisional',
    batchUnits: 4,
    unitName: 'set (isi 4 pcs)',
    items: [
      { id: '1', name: 'Tali Rami Alami Roll (Goni)', quantity: '1 roll (50m)', cost: 20000 },
      { id: '2', name: 'Isi Lem Tembak (Glue Gun Refill)', quantity: '1 pack', cost: 8000 },
      { id: '3', name: 'Pernis Pelindung Serat Kayu/Rami', quantity: '1/2 kaleng', cost: 8000 },
      { id: '4', name: 'Pita Kertas & Tali Rami Pemanis', quantity: '1 roll', cost: 5000 },
      { id: '5', name: 'Stiker Label Merek Usaha Tahan Air', quantity: '4 pcs', cost: 2000 },
    ],
    defaultMarginPercent: 45,
  },
];
