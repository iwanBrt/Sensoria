import React from 'react';
import { Link } from 'react-router-dom';
import { useA11y } from '../context/A11yContext';
import { initialCourses } from '../data/coursesData';
import {
  BookOpen,
  Calculator,
  Ear,
  Eye,
  Headphones,
  MousePointerClick,
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';

const Home = () => {
  const {
    highContrast,
    toggleHighContrast,
    increaseFontSize,
    toggleScreenReaderAssist,
    speak,
    announce
  } = useA11y();

  const handleSelectMode = (type) => {
    switch (type) {
      case 'netra':
        announce("Mode Suara Aktif. Sistem akan membacakan teks dan tombol untukmu.");
        speak("Mode suara diaktifkan. Gunakan tombol Tab untuk berpindah, dan Enter untuk memilih.");
        break;
      case 'kurang_awas':
        if (!highContrast) toggleHighContrast();
        increaseFontSize();
        announce("Mode Kontras Tinggi dan Huruf Besar Aktif.");
        speak("Mode huruf besar dan kontras tinggi telah aktif.");
        break;
      case 'rungu':
        announce("Mode Bahasa Isyarat dan Takarir Teks Aktif.");
        speak("Mode visual aktif. Video dilengkapi takarir teks dan juru bahasa isyarat.");
        break;
      case 'wicara':
        announce("Mode Sentuh Aktif. Belajar dengan menekan tombol, tanpa kewajiban suara.");
        speak("Mode sentuh aktif. Kamu dapat belajar mandiri tanpa perlu berbicara.");
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section
        className={`py-10 sm:py-16 border-b transition-colors ${
          highContrast
            ? 'bg-black border-yellow-400 text-yellow-300'
            : 'bg-gradient-to-b from-slate-50 via-blue-50/30 to-white border-slate-200'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="max-w-3xl">
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border ${
                highContrast
                  ? 'bg-yellow-400 text-black border-yellow-300'
                  : 'bg-blue-100 border-blue-200 text-blue-900'
              }`}
            >
              <span>Platform Pembelajaran Vokasi Sensorik</span>
            </div>

            <h1
              className={`text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4 ${
                highContrast ? 'text-yellow-400' : 'text-slate-900'
              }`}
            >
              Belajar Keterampilan Mandiri & Hitung Untung Usaha
            </h1>

            <p
              className={`text-base sm:text-xl leading-relaxed mb-8 ${
                highContrast ? 'text-yellow-200' : 'text-slate-600'
              }`}
            >
              Akses video praktik keterampilan dengan juru bahasa isyarat (JBI), takarir teks (CC), deskripsi audio, dan kalkulator laba rugi yang mudah dipahami.
            </p>

            <div className="flex flex-wrap gap-4 items-center justify-center sm:justify-start">
              <Link
                to="/courses"
                className={`inline-flex items-center gap-2.5 px-7 py-4 rounded-xl font-bold text-base shadow-sm transition active:scale-95 ${
                  highContrast
                    ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
                aria-label="Lihat Semua Pilihan Kelas Vokasi"
              >
                <Layers className="w-5 h-5" aria-hidden="true" />
                <span>Buka Katalog Kelas ({initialCourses.length} Materi)</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>

              <Link
                to="/course?id=lilin-aromaterapi&tab=accounting"
                className={`inline-flex items-center gap-2.5 px-6 py-4 rounded-xl font-bold text-base border-2 transition ${
                  highContrast
                    ? 'border-yellow-400 bg-black text-yellow-300 hover:bg-yellow-950'
                    : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800'
                }`}
                aria-label="Buka Kalkulator Modal dan Laba Usaha"
              >
                <Calculator className="w-5 h-5" aria-hidden="true" />
                <span>Kalkulator Modal & Laba</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SENSORY MODE PROFILES */}
      <section
        className={`py-12 border-b transition-colors ${
          highContrast ? 'bg-black border-yellow-400' : 'bg-slate-50 border-slate-200'
        }`}
        aria-label="Pilihan Profil Bantuan Sensori"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2
              className={`text-xl sm:text-2xl font-black mb-1 ${
                highContrast ? 'text-yellow-400' : 'text-slate-900'
              }`}
            >
              Pilih Bantuan Aksesibilitas Sesuai Kebutuhanmu:
            </h2>
            <p className={`text-sm ${highContrast ? 'text-yellow-200' : 'text-slate-600'}`}>
              Klik kartu di bawah ini untuk menyesuaikan tampilan dan suara secara instan:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Tunanetra */}
            <button
              type="button"
              onClick={() => handleSelectMode('netra')}
              className={`p-5 rounded-2xl border-2 text-left transition transform hover:-translate-y-0.5 active:scale-95 flex flex-col justify-between ${
                highContrast
                  ? 'bg-black border-yellow-400 text-yellow-300 hover:bg-yellow-950'
                  : 'bg-white border-slate-200 hover:border-blue-400 shadow-sm'
              }`}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold mb-3 border border-blue-200">
                  <Headphones className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-base">Mode Suara</h3>
                <span className="text-xs font-semibold text-blue-600 block mt-0.5">
                  Untuk Tunanetra
                </span>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Narasi audio otomatis pada tombol dan pembacaan materi suara.
                </p>
              </div>
              <span className="text-xs font-bold text-blue-600 mt-4 block">Aktifkan Suara →</span>
            </button>

            {/* 2. Kurang Awas */}
            <button
              type="button"
              onClick={() => handleSelectMode('kurang_awas')}
              className={`p-5 rounded-2xl border-2 text-left transition transform hover:-translate-y-0.5 active:scale-95 flex flex-col justify-between ${
                highContrast
                  ? 'bg-yellow-400 text-black border-yellow-300 font-black'
                  : 'bg-white border-slate-200 hover:border-amber-400 shadow-sm'
              }`}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold mb-3 border border-amber-200">
                  <Eye className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-base">Kontras & Teks Besar</h3>
                <span className={`text-xs font-semibold block mt-0.5 ${highContrast ? 'text-black' : 'text-amber-700'}`}>
                  Untuk Kurang Awas
                </span>
                <p className={`text-xs mt-2 leading-relaxed ${highContrast ? 'text-black' : 'text-slate-500'}`}>
                  Latar hitam pekat, teks kuning tegas, dan ukuran font membesar.
                </p>
              </div>
              <span className={`text-xs font-bold mt-4 block ${highContrast ? 'text-black underline' : 'text-amber-700'}`}>
                Perbesar Tampilan →
              </span>
            </button>

            {/* 3. Tunarungu */}
            <button
              type="button"
              onClick={() => handleSelectMode('rungu')}
              className={`p-5 rounded-2xl border-2 text-left transition transform hover:-translate-y-0.5 active:scale-95 flex flex-col justify-between ${
                highContrast
                  ? 'bg-black border-yellow-400 text-yellow-300 hover:bg-yellow-950'
                  : 'bg-white border-slate-200 hover:border-emerald-400 shadow-sm'
              }`}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-3 border border-emerald-200">
                  <Ear className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-base">Bahasa Isyarat & CC</h3>
                <span className="text-xs font-semibold text-emerald-600 block mt-0.5">
                  Untuk Tunarungu
                </span>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Video dilengkapi penerjemah isyarat (JBI) dan teks takarir tebal.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-600 mt-4 block">Buka Mode Isyarat →</span>
            </button>

            {/* 4. Tunawicara */}
            <button
              type="button"
              onClick={() => handleSelectMode('wicara')}
              className={`p-5 rounded-2xl border-2 text-left transition transform hover:-translate-y-0.5 active:scale-95 flex flex-col justify-between ${
                highContrast
                  ? 'bg-black border-yellow-400 text-yellow-300 hover:bg-yellow-950'
                  : 'bg-white border-slate-200 hover:border-purple-400 shadow-sm'
              }`}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold mb-3 border border-purple-200">
                  <MousePointerClick className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-base">Navigasi Sentuh</h3>
                <span className="text-xs font-semibold text-purple-600 block mt-0.5">
                  Untuk Tunawicara
                </span>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Semua langkah menggunakan tombol ketuk cepat tanpa rekam suara.
                </p>
              </div>
              <span className="text-xs font-bold text-purple-600 mt-4 block">Mode Sentuh Penuh →</span>
            </button>
          </div>
        </div>
      </section>

      {/* FEATURED VOCATIONAL COURSES PREVIEW */}
      <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2
              className={`text-2xl font-black ${
                highContrast ? 'text-yellow-400' : 'text-slate-900'
              }`}
            >
              Kelas Praktik Keterampilan Pilihan
            </h2>
            <p className={`text-sm mt-1 ${highContrast ? 'text-yellow-200' : 'text-slate-600'}`}>
              Materi keterampilan vokasi siap pakai untuk melatih kemandirian berusaha.
            </p>
          </div>

          <Link
            to="/courses"
            className={`text-sm font-bold flex items-center gap-1 transition ${
              highContrast ? 'text-yellow-300 hover:underline' : 'text-blue-600 hover:text-blue-800'
            }`}
          >
            <span>Lihat Semua ({initialCourses.length})</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {initialCourses.slice(0, 2).map((course) => (
            <div
              key={course.id}
              className={`p-6 rounded-2xl border-2 transition flex flex-col justify-between ${
                highContrast
                  ? 'bg-black border-yellow-400 text-yellow-300'
                  : 'bg-white border-slate-200 text-slate-900 hover:border-blue-300 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                      highContrast
                        ? 'bg-yellow-950 text-yellow-300 border border-yellow-400'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {course.category}
                  </span>
                  <span className="text-xs text-slate-500">{course.durationText}</span>
                </div>

                <h3 className="text-xl font-black mb-2">{course.title}</h3>
                <p className={`text-sm leading-relaxed mb-6 ${highContrast ? 'text-yellow-200' : 'text-slate-600'}`}>
                  {course.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-yellow-400/30 flex items-center justify-between">
                <Link
                  to={`/course?id=${course.id}`}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition ${
                    highContrast
                      ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  <BookOpen className="w-4 h-4" aria-hidden="true" />
                  <span>Mulai Praktik</span>
                </Link>

                <Link
                  to={`/course?id=${course.id}&tab=accounting`}
                  className={`text-xs font-bold underline px-3 py-2 ${
                    highContrast ? 'text-yellow-300' : 'text-slate-700 hover:text-blue-600'
                  }`}
                >
                  Kalkulator Untung →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
