// Data pusat materi vokasi SENSORIA yang dapat dikelola dinamis melalui Dashboard Admin
export const initialCourses = [
  {
    id: "lilin-aromaterapi",
    title: "Pembuatan Lilin Aromaterapi Lavender",
    category: "Kriya & Kerajinan",
    durationText: "4 Langkah • 15 Menit",
    videoDuration: "15:20",
    thumbnail: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
    defaultModal: 15000,
    defaultPrice: 35000,
    description: "Keterampilan membuat lilin kedelai ramah lingkungan dengan wangi minyak aromaterapi yang menenangkan.",
    sensoryFeatures: ["audio_desc", "subtitles", "jbi", "high_contrast", "touch_ready"],
    sensoryHighlights: {
      netra: "Narasi suara deskriptif untuk takaran soy wax dan suhu lilin",
      rungu: "Takarir CC teks sinkron & video penerjemah isyarat JBI BISINDO",
      kurang_awas: "Warna kontras tinggi dan garis tepi penanda sumbu lilin",
      wicara: "Kalkulator modal lilin berbasis tombol sentuh tanpa suara"
    },
    steps: [
      {
        id: 1,
        title: "1. Persiapan Alat dan Bahan Baku",
        duration: 35,
        summary: "Siapkan serpihan lilin kedelai (soy wax), wadah toples kaca tahan panas, sumbu katun bebas timbal, dan minyak esensial lavender.",
        audioDescription: "Instruktur meletakkan toples kaca, mangkuk berisi lilin kedelai putih, dan botol minyak lavender di atas meja kerja.",
        materials: [
          "Serpihan Lilin Kedelai (Soy Wax) 200 gram",
          "Sumbu Katun dengan Penyangga",
          "Minyak Esensial Lavender 10 ml",
          "Toples Kaca Tahan Panas"
        ],
        subtitles: [
          { start: 0, end: 10, text: "Selamat datang di kelas vokasi SENSORIA. Hari ini kita belajar membuat lilin aromaterapi." },
          { start: 10, end: 22, text: "Lilin kedelai alami sangat aman bagi kesehatan dan ramah lingkungan." },
          { start: 22, end: 35, text: "Pastikan semua bahan sudah tersusun rapi di atas meja sebelum mulai." }
        ]
      },
      {
        id: 2,
        title: "2. Pelelehan Lilin Kedelai",
        duration: 40,
        summary: "Panaskan mangkuk lilin di atas panci air panas dengan teknik pemanasan tidak langsung hingga mencair merata.",
        audioDescription: "Serpihan lilin di dalam mangkuk perlahan mencair terkena uap air mendidih menjadi cairan kuning bening.",
        materials: [
          "Panci pemanas air",
          "Mangkuk wadah lilin tahan panas",
          "Sendok pengaduk kayu"
        ],
        subtitles: [
          { start: 0, end: 12, text: "Panaskan mangkuk berisi lilin di atas panci air hangat secara perlahan." },
          { start: 12, end: 26, text: "Aduk perlahan menggunakan sendok kayu hingga seluruh butiran lilin mencair." },
          { start: 26, end: 40, text: "Setelah mencair sempurna, matikan kompor dan biarkan suhu lilin menurun sejenak." }
        ]
      },
      {
        id: 3,
        title: "3. Pencampuran Aroma dan Penuangan",
        duration: 45,
        summary: "Teteskan minyak lavender saat lilin hangat kuku. Pasang sumbu di tengah toples, lalu tuang lilin perlahan hingga penuh.",
        audioDescription: "Minyak aromaterapi diteteskan ke lilin cair. Lilin dituangkan ke toples dengan sumbu terjepit tegak di bagian tengah.",
        materials: [
          "Minyak esensial lavender",
          "Penjepit kayu penyangga sumbu",
          "Lap kain pembersih"
        ],
        subtitles: [
          { start: 0, end: 14, text: "Teteskan minyak esensial ketika lilin hangat agar aroma wangi tidak cepat menguap." },
          { start: 14, end: 28, text: "Posisikan sumbu lilin tepat di tengah toples menggunakan bantuan penjepit kayu." },
          { start: 28, end: 45, text: "Tuang lilin cair ke toples secara perlahan dan biarkan memadat selama 3 jam." }
        ]
      },
      {
        id: 4,
        title: "4. Penyempurnaan Sumbu dan Pelabelan",
        duration: 35,
        summary: "Gunting sumbu hingga tersisa sekitar setengah sentimeter. Tempelkan label nama usahamu pada toples kaca.",
        audioDescription: "Lilin telah mengeras putih pekat. Instruktur merapikan sumbu dengan gunting dan menempelkan stiker merek produk.",
        materials: [
          "Gunting tajam",
          "Stiker label merek lilin",
          "Kemasan karton pengaman"
        ],
        subtitles: [
          { start: 0, end: 12, text: "Setelah lilin memadat sepenuhnya, potong kelebihan sumbu dengan gunting." },
          { start: 12, end: 24, text: "Tempelkan stiker label usahamu dengan rapi pada permukaan toples." },
          { start: 24, end: 35, text: "Produk lilin aromaterapimu telah siap dipasarkan. Sekarang mari hitung keuntungannya." }
        ]
      }
    ]
  },
  {
    id: "sabun-organik",
    title: "Pembuatan Sabun Cuci Tangan Herbal",
    category: "Kriya & Sanitasi",
    durationText: "4 Langkah • 20 Menit",
    videoDuration: "20:45",
    thumbnail: "https://images.unsplash.com/photo-1607006314644-84610115e5b8?auto=format&fit=crop&w=800&q=80",
    defaultModal: 12000,
    defaultPrice: 28000,
    description: "Keterampilan memproduksi sabun pembersih berbahan dasar minyak kelapa dan lidah buaya yang lembut di kulit.",
    sensoryFeatures: ["audio_desc", "subtitles", "jbi", "high_contrast", "touch_ready"],
    sensoryHighlights: {
      netra: "Deskripsi audio adegan pelelehan gliserin dan pencetakan",
      rungu: "Takarir CC jelas dan video bahasa isyarat gerakan tangan",
      kurang_awas: "Siluet kontras cetakan silikon agar takaran tidak tumpah",
      wicara: "Hitung untung otomatis per batang sabun tanpa bicara"
    },
    steps: [
      {
        id: 1,
        title: "1. Menyiapkan Bahan Dasar Sabun",
        duration: 30,
        summary: "Siapkan basis sabun gliserin transparan, ekstrak lidah buaya, cetakan silikon, dan pewangi alami.",
        audioDescription: "Potongan bahan sabun bening berbentuk kubus kecil tertata rapi di samping cetakan silikon biru.",
        materials: [
          "Sabun gliserin nabati (Melt and Pour) 250 gram",
          "Gel lidah buaya segar 20 ml",
          "Pewangi alami lemon",
          "Cetakan sabun silikon"
        ],
        subtitles: [
          { start: 0, end: 10, text: "Selamat datang di kelas pembuatan sabun herbal mandiri." },
          { start: 10, end: 20, text: "Kita menggunakan bahan sabun gliserin alami yang sangat aman diproses." },
          { start: 20, end: 30, text: "Potong bahan sabun menjadi dadu kecil agar cepat mencair saat dipanaskan." }
        ]
      },
      {
        id: 2,
        title: "2. Pelelehan Basis Sabun",
        duration: 35,
        summary: "Lelehkan potongan gliserin menggunakan wadah tahan panas dengan api kecil hingga mencair merata.",
        audioDescription: "Kubus sabun mencair perlahan menjadi cairan jernih transparan di dalam wadah pemanas.",
        materials: [
          "Panci pemanas",
          "Sendok pengaduk silikon"
        ],
        subtitles: [
          { start: 0, end: 12, text: "Cairkan bahan sabun dengan panas sedang dan jangan sampai mendidih berlebihan." },
          { start: 12, end: 25, text: "Aduk perlahan untuk mencegah terbentuknya gelembung udara pada sabun." },
          { start: 25, end: 35, text: "Angkat cairan sabun setelah seluruh bagian mencair sempurna." }
        ]
      },
      {
        id: 3,
        title: "3. Penambahan Gel Herbal dan Pencetakan",
        duration: 40,
        summary: "Campurkan gel lidah buaya dan aroma lemon, lalu tuang ke cetakan silikon.",
        audioDescription: "Cairan sabun hijau muda dituangkan perlahan ke dalam cetakan silikon berbentuk kotak berjejer.",
        materials: [
          "Gel lidah buaya",
          "Cetakan silikon bentuk daun dan bunga"
        ],
        subtitles: [
          { start: 0, end: 15, text: "Campurkan gel lidah buaya ke dalam cairan sabun untuk menjaga kelembapan kulit." },
          { start: 15, end: 28, text: "Tuang ke cetakan silikon dengan hati-hati hingga batas garis cetakan." },
          { start: 28, end: 40, text: "Biarkan sabun mendingin dan mengeras selama dua jam pada suhu ruangan." }
        ]
      },
      {
        id: 4,
        title: "4. Pengemasan Kertas Ramah Lingkungan",
        duration: 30,
        summary: "Keluarkan sabun dari cetakan dan bungkus dengan kertas daur ulang berlabel untuk menjaga kualitasnya.",
        audioDescription: "Sabun padat bening dikeluarkan dari silikon dan dibungkus rapi dengan kertas cokelat ramah lingkungan.",
        materials: [
          "Kertas pembungkus ramah lingkungan",
          "Tali rami pemanis kemasan",
          "Label merek"
        ],
        subtitles: [
          { start: 0, end: 10, text: "Tekan bagian bawah cetakan silikon untuk mengeluarkan sabun padat." },
          { start: 10, end: 20, text: "Bungkus sabun dengan kertas lilin atau kertas daur ulang agar tidak berdebu." },
          { start: 20, end: 30, text: "Sabun herbal siap dipasarkan dengan kemasan cantik dan bernilai jual tinggi." }
        ]
      }
    ]
  },
  {
    id: "kue-kering",
    title: "Tata Boga: Membuat Kue Kering Cokelat",
    category: "Tata Boga & Kuliner",
    durationText: "4 Langkah • 25 Menit",
    videoDuration: "24:30",
    thumbnail: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80",
    defaultModal: 20000,
    defaultPrice: 45000,
    description: "Pelatihan keterampilan memanggang kue kering cokelat renyah yang diminati banyak orang untuk usaha rumahan.",
    sensoryFeatures: ["audio_desc", "subtitles", "jbi", "high_contrast", "touch_ready"],
    sensoryHighlights: {
      netra: "Instruksi audio perbandingan gram adonan dan waktu memanggang",
      rungu: "Panduan takarir kata-per-kata dan isyarat untuk takaran mentega",
      kurang_awas: "Teks resep ekstra besar dan panduan visual loyang oven",
      wicara: "Kalkulator harga toples kue dengan input tombol sentuh"
    },
    steps: [
      {
        id: 1,
        title: "1. Menimbang Bahan Adonan",
        duration: 35,
        summary: "Timbang tepung terigu, mentega, bubuk cokelat berkualitas, dan gula halus sesuai takaran.",
        audioDescription: "Tepung dan cokelat bubuk ditakar pada timbangan digital dengan mangkuk stainless.",
        materials: [
          "Tepung terigu protein rendah 250 gr",
          "Mentega 150 gr",
          "Bubuk cokelat murni 50 gr",
          "Gula halus 80 gr"
        ],
        subtitles: [
          { start: 0, end: 12, text: "Selamat datang di kelas tata boga mandiri SENSORIA." },
          { start: 12, end: 24, text: "Langkah pertama adalah menakar bahan dengan tepat agar tekstur kue renyah sempurna." },
          { start: 24, end: 35, text: "Siapkan mentega pada suhu ruang agar mudah diaduk bersama gula halus." }
        ]
      },
      {
        id: 2,
        title: "2. Mengaduk Adonan Kue",
        duration: 40,
        summary: "Campurkan mentega dan gula halus hingga lembut, masukkan cokelat bubuk dan tepung, aduk hingga kalis.",
        audioDescription: "Spatula mengaduk mentega dan tepung cokelat hingga membentuk gumpalan adonan padat yang tidak lengket.",
        materials: [
          "Spatula pengaduk",
          "Wadah baskom pencampur"
        ],
        subtitles: [
          { start: 0, end: 15, text: "Aduk mentega dan gula sampai warnanya sedikit memucat dan teksturnya halus." },
          { start: 15, end: 28, text: "Tambahkan tepung terigu dan bubuk cokelat secara bertahap." },
          { start: 28, end: 40, text: "Aduk adonan hingga kalis dan mudah dibentuk dengan tangan." }
        ]
      },
      {
        id: 3,
        title: "3. Mencetak dan Memanggang",
        duration: 45,
        summary: "Bentuk bulatan kecil adonan di atas loyang, beri hiasan chocochips, dan panggang pada oven bersuhu 150 derajat.",
        audioDescription: "Loyang berisi bulatan adonan kue cokelat dimasukkan ke dalam rak oven listrik.",
        materials: [
          "Loyang panggangan berlapis kertas roti",
          "Chocochips hiasan",
          "Sarung tangan oven anti-panas"
        ],
        subtitles: [
          { start: 0, end: 15, text: "Bentuk adonan menjadi bulatan rata dan susun di loyang dengan jarak teratur." },
          { start: 15, end: 30, text: "Tekan sedikit bagian atasnya dan letakkan butiran chocochips sebagai pemanis." },
          { start: 30, end: 45, text: "Panggang selama 20 hingga 25 menit sampai aroma kue cokelat harum matang." }
        ]
      },
      {
        id: 4,
        title: "4. Pengemasan Toples Kedap Udara",
        duration: 35,
        summary: "Dinginkan kue kering, susun rapi ke dalam toples bening, rekatkan segel pengaman dan stiker harga.",
        audioDescription: "Kue kering cokelat yang telah dingin dimasukkan satu per satu ke toples plastik dengan penutup rapat.",
        materials: [
          "Toples plastik tebal 500 gram",
          "Solasi segel higienis",
          "Stiker label nama toko"
        ],
        subtitles: [
          { start: 0, end: 12, text: "Pastikan kue sudah benar-benar dingin sebelum dimasukkan ke dalam toples." },
          { start: 12, end: 24, text: "Tutup rapat toples dan beri segel pengaman agar kue tetap renyah tahan lama." },
          { start: 24, end: 35, text: "Kue kering cokelat lezat siap dijual kepada pelanggan setia tokomu." }
        ]
      }
    ]
  },
  {
    id: "anyaman-kriya",
    title: "Kerajinan Kriya: Tatakan Gelas Anyaman",
    category: "Kriya Tradisional",
    durationText: "4 Langkah • 20 Menit",
    videoDuration: "18:15",
    thumbnail: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80",
    defaultModal: 10000,
    defaultPrice: 25000,
    description: "Pelatihan seni merangkai serat alami menjadi tatakan gelas dan taplak meja mini yang bernilai estetika tinggi.",
    sensoryFeatures: ["audio_desc", "subtitles", "jbi", "high_contrast", "touch_ready"],
    sensoryHighlights: {
      netra: "Panduan audio taktil rabaan tekstur tali rami dan kerapatan putaran",
      rungu: "Demonstrasi video isyarat JBI teknik anyaman spiral dari tengah",
      kurang_awas: "Garis panduan pola lingkaran anyaman dengan kontras tinggi",
      wicara: "Hitung margin untung paket 4 tatakan dengan kalkulator sentuh"
    },
    steps: [
      {
        id: 1,
        title: "1. Pemilihan Serat dan Tali Rami",
        duration: 30,
        summary: "Pilih serat rami atau enceng gondok yang bersih, lentur, dan bebas jamur untuk bahan anyaman.",
        audioDescription: "Gulungan tali rami cokelat muda dan cetakan bundar diletakkan di atas meja anyam.",
        materials: [
          "Tali rami alami 10 meter",
          "Pola lingkaran karton",
          "Gunting potong serat"
        ],
        subtitles: [
          { start: 0, end: 10, text: "Kerajinan anyaman serat alami memiliki nilai jual tinggi dan diminati banyak kafe." },
          { start: 10, end: 20, text: "Siapkan tali rami lentur berukuran sedang sebagai bahan anyaman utama." },
          { start: 20, end: 30, text: "Gunakan alas karton lingkaran sebagai panduan ukuran tatakan gelas." }
        ]
      },
      {
        id: 2,
        title: "2. Memulai Anyaman Pola Spiral",
        duration: 35,
        summary: "Gulung tali membentuk spiral kecil sebagai titik tengah tatakan, eratkan sambungan dengan lem tembak.",
        audioDescription: "Tangan instruktur memutar tali secara melingkar konsentris dan merekatkan setiap putaran dengan lem.",
        materials: [
          "Alat lem tembak / perekat serat",
          "Penjepit kayu penahan putaran"
        ],
        subtitles: [
          { start: 0, end: 12, text: "Bentuk simpul lingkaran rapat di bagian tengah sebagai pusat anyaman." },
          { start: 12, end: 25, text: "Putar tali mengikuti arah melingkar spiral secara perlahan dan rapat." },
          { start: 25, end: 35, text: "Rekatkan setiap baris tali dengan lem tembak agar anyaman kokoh dan padat." }
        ]
      },
      {
        id: 3,
        title: "3. Merapikan Anyaman dan Pinggiran",
        duration: 40,
        summary: "Lanjutkan putaran hingga diameter 12 cm, kunci ujung tali rami di sisi belakang tatakan.",
        audioDescription: "Anyaman lingkaran diperiksa kerapatannya, ujung tali dipotong serong dan diselipkan ke bagian bawah.",
        materials: [
          "Gunting benang",
          "Kuas pernis pelindung serat"
        ],
        subtitles: [
          { start: 0, end: 15, text: "Lanjutkan putaran sampai tatakan mencapai ukuran standar tatakan gelas." },
          { start: 15, end: 28, text: "Potong ujung tali secara rapi dan selipkan di bagian bawah tatakan." },
          { start: 28, end: 40, text: "Lapisi permukaan dengan pelindung serat alami agar tahan terhadap tetesan air." }
        ]
      },
      {
        id: 4,
        title: "4. Pengikatan Paket dan Label Produk",
        duration: 30,
        summary: "Ikat empat buah tatakan gelas menjadi satu set menggunakan pita kertas dan label kriya mandiri.",
        audioDescription: "Empat tatakan anyaman ditumpuk rapi dan diikat dengan pita kertas cokelat bertuliskan SENSORIA Craft.",
        materials: [
          "Pita kertas pengikat paket",
          "Label produk buatan tangan"
        ],
        subtitles: [
          { start: 0, end: 10, text: "Produk anyaman lebih laku dijual dalam bentuk satu paket berisi empat tatakan." },
          { start: 10, end: 20, text: "Satukan tumpukan tatakan dengan pita kertas sederhana yang estetik." },
          { start: 20, end: 30, text: "Tatakan anyaman serat alami siap dipajang di etalase dan dijual ke konsumen." }
        ]
      }
    ]
  }
];
