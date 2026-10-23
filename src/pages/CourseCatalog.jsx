import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useA11y } from '../context/A11yContext';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import {
  BookOpen,
  Calculator,
  Search,
  ArrowRight,
  Play,
  Clock,
  Ear,
  MousePointerClick,
  CheckCircle2,
  Subtitles,
  UserCheck,
  Info,
  Sparkles
} from 'lucide-react';

// Helper to get tailored media and sensory adaptation by course
const getCourseMedia = (course) => {
  const titleLower = (course.title || '').toLowerCase();
  if (titleLower.includes('sabun')) {
    return {
      thumbnail: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=800&q=80',
      duration: '20:45',
      highlights: {
        rungu: 'Takarir CC sinkron kata demi kata & video bahasa isyarat gerakan cetakan',
        wicara: 'Hitung modal & laba sabun dengan kalkulator sentuh tanpa suara',
      }
    };
  }
  if (titleLower.includes('kue') || titleLower.includes('choco') || titleLower.includes('boga')) {
    return {
      thumbnail: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80',
      duration: '24:30',
      highlights: {
        rungu: 'Takarir teks per langkah dan video JBI untuk teknik mengaduk adonan',
        wicara: 'Simulasi harga toples kue kering dengan formula kalkulator sentuh',
      }
    };
  }
  if (titleLower.includes('anyaman') || titleLower.includes('tatakan') || titleLower.includes('serat')) {
    return {
      thumbnail: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80',
      duration: '18:15',
      highlights: {
        rungu: 'Demonstrasi peraga isyarat BISINDO teknik memutar tali melingkar',
        wicara: 'Kalkulasi laba paket 4 tatakan dengan tombol sentuh interaktif',
      }
    };
  }
  return {
    thumbnail: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
    duration: '15:20',
    highlights: {
      rungu: 'Takarir CC teks sinkron & video penerjemah isyarat JBI BISINDO',
      wicara: 'Kalkulator modal lilin berbasis tombol sentuh tanpa suara',
    }
  };
};

const CourseCatalog = () => {
  const { highContrast } = useA11y();
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedSensoryFilter, setSelectedSensoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeModalCourse, setActiveModalCourse] = useState(null);

  const categories = ['Semua', 'Kriya & Kerajinan', 'Kriya & Sanitasi', 'Tata Boga & Kuliner', 'Kriya Tradisional'];

  const sensoryOptions = [
    { key: 'all', label: 'Semua Ragam (Rungu & Wicara)', icon: Sparkles },
    { key: 'rungu', label: 'Tunarungu (Takarir CC & JBI)', icon: Ear },
    { key: 'wicara', label: 'Tunawicara (Navigasi Sentuh)', icon: MousePointerClick },
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await dbService.getCourses();
      setCourses(data);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchCategory = selectedCategory === 'Semua' || course.category === selectedCategory;
    const matchSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchSensory = true;
    if (selectedSensoryFilter === 'rungu') {
      matchSensory = Boolean(course.sensoryHighlights?.rungu || course.steps?.some(s => s.subtitles?.length));
    } else if (selectedSensoryFilter === 'wicara') {
      matchSensory = Boolean(course.sensoryHighlights?.wicara);
    }

    return matchCategory && matchSearch && matchSensory;
  });

  return (
    <div className="w-full py-6 sm:py-10 md:py-12">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Title & Description */}
        <div className="mb-6">
          <h1
            className={`text-2xl sm:text-4xl font-black ${
              highContrast ? 'text-yellow-400' : 'text-slate-900'
            }`}
          >
            Pilihan Keterampilan Mandiri
          </h1>
          <p className={`text-base sm:text-lg mt-2 max-w-3xl ${highContrast ? 'text-yellow-200' : 'text-slate-600'}`}>
            Tonton video tutorial keterampilan vokasi dengan pratinjau cuplikan visual. Setiap materi terkalibrasi khusus dengan Takarir CC, JBI Isyarat BISINDO, dan Kalkulator Harga Jual Cerdas.
          </p>
        </div>

        {/* Personalized Student Awareness Banner (if logged in) */}
        {currentUser && currentUser.sensoryProfile && (
          <div
            className={`mb-6 p-4 sm:p-5 rounded-2xl border-2 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              highContrast
                ? 'bg-black border-yellow-400 text-yellow-300'
                : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  highContrast ? 'bg-yellow-400 text-black' : 'bg-blue-600 text-white'
                }`}
              >
                {currentUser.sensoryProfile === 'rungu' && <Ear className="w-5 h-5" />}
                {currentUser.sensoryProfile === 'wicara' && <MousePointerClick className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider opacity-80">
                  Profil Peserta: {currentUser.name}
                </p>
                <p className="text-sm font-bold mt-0.5">
                  {currentUser.sensoryProfile === 'rungu' && 'Mode Tunarungu Aktif: Seluruh video otomatis menampilkan Takarir CC & Juru Bahasa Isyarat JBI.'}
                  {currentUser.sensoryProfile === 'wicara' && 'Mode Tunawicara Aktif: Navigasi mandiri dengan sentuhan tanpa membutuhkan input vokal.'}
                </p>
              </div>
            </div>
            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border whitespace-nowrap ${
                highContrast
                  ? 'border-yellow-400 bg-yellow-400 text-black'
                  : 'bg-white border-blue-200 text-blue-700 shadow-sm'
              }`}
            >
              Teradaptasi Otomatis
            </span>
          </div>
        )}

        {/* Sensory Filter Tabs */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${highContrast ? 'text-yellow-300' : 'text-slate-500'}`}>
              Filter Penyesuaian Sensori:
            </span>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter Ragam Disabilitas">
            {sensoryOptions.map((opt) => {
              const IconComp = opt.icon;
              const isSelected = selectedSensoryFilter === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setSelectedSensoryFilter(opt.key)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
                    isSelected
                      ? highContrast
                        ? 'bg-yellow-400 text-black border-yellow-300 shadow-sm'
                        : 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : highContrast
                      ? 'border-yellow-400/50 text-yellow-300 hover:bg-yellow-950/40'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                  aria-pressed={isSelected}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-2" role="group" aria-label="Kategori Kelas">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                  selectedCategory === cat
                    ? highContrast
                      ? 'bg-yellow-400 text-black border-yellow-300'
                      : 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : highContrast
                    ? 'border-yellow-400/50 text-yellow-300 hover:bg-yellow-950/40'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
                aria-pressed={selectedCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-auto md:min-w-[260px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Cari materi tutorial video..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition ${
                highContrast
                  ? 'bg-black border-yellow-400 text-yellow-300 focus:ring-2 focus:ring-yellow-400'
                  : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
              }`}
              aria-label="Cari materi pembelajaran vokasi"
            />
          </div>
        </div>

        {/* Course Cards Grid */}
        {loading ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            Memuat daftar video tutorial dari database...
          </div>
        ) : filteredCourses.length === 0 ? (
          <div
            className={`text-center py-16 rounded-2xl border ${
              highContrast ? 'border-yellow-400 text-yellow-300' : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <p className="text-base font-bold">Tidak ada video yang cocok dengan pencarian / filter ini.</p>
            <button
              onClick={() => {
                setSelectedCategory('Semua');
                setSelectedSensoryFilter('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs font-bold underline text-blue-600 dark:text-yellow-300"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {filteredCourses.map((course) => {
              const media = getCourseMedia(course);
              const thumbnailSrc = (course.thumbnail && !course.thumbnail.includes('be475563bc59')) ? course.thumbnail : media.thumbnail;
              const videoDuration = course.videoDuration || media.duration;
              const courseWithMedia = { ...course, thumbnail: thumbnailSrc, videoDuration, sensoryHighlights: course.sensoryHighlights || media.highlights };

              return (
                <div
                  key={course.id}
                  className={`group rounded-2xl border-2 overflow-hidden transition-all duration-200 flex flex-col justify-between ${
                    highContrast
                      ? 'bg-black border-yellow-400 text-yellow-300'
                      : 'bg-white border-slate-200 text-slate-900 hover:border-blue-400 hover:shadow-xl'
                  }`}
                >
                  {/* VIDEO PREVIEW THUMBNAIL CONTAINER */}
                  <div>
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                      <img
                        src={thumbnailSrc}
                        alt={`Pratinjau video tutorial: ${course.title}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Dark overlay for contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

                      {/* Top Badges */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2">
                        <span
                          className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md ${
                            highContrast
                              ? 'bg-yellow-400 text-black'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          {course.category}
                        </span>

                        <span className="text-[11px] font-bold px-2 py-1 rounded-md bg-black/75 text-white backdrop-blur-sm border border-white/20 flex items-center gap-1 shadow-md">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>{videoDuration}</span>
                        </span>
                      </div>

                      {/* Center Play Button Overlay */}
                      <Link
                        to={`/course?id=${course.id}`}
                        className="absolute inset-0 flex items-center justify-center group/btn"
                        aria-label={`Buka dan putar video tutorial ${course.title}`}
                      >
                        <div
                          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform group-hover/btn:scale-110 ${
                            highContrast
                              ? 'bg-yellow-400 text-black border-2 border-yellow-300 ring-4 ring-yellow-400/40'
                              : 'bg-blue-600 text-white hover:bg-blue-500 ring-4 ring-white/30'
                          }`}
                        >
                          <Play className="w-6 h-6 fill-current ml-1" />
                        </div>
                        <span className="sr-only">Putar Video Tutorial</span>
                      </Link>

                      {/* Bottom Overlay Features Preview */}
                      <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2 text-white text-xs">
                        <span className="bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-bold border border-white/10">
                          {course.durationText}
                        </span>

                        <div className="flex items-center gap-1">
                          <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                            <Subtitles className="w-3 h-3" />
                            CC
                          </span>
                          <span className="bg-purple-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                            <UserCheck className="w-3 h-3" />
                            JBI
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* CARD BODY CONTENT */}
                    <div className="p-5 sm:p-6">
                      <h2 className="text-xl sm:text-2xl font-black mb-2 leading-snug">
                        <Link
                          to={`/course?id=${course.id}`}
                          className="hover:underline focus:outline-none"
                        >
                          {course.title}
                        </Link>
                      </h2>

                      <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${highContrast ? 'text-yellow-200' : 'text-slate-600'}`}>
                        {course.description}
                      </p>

                      {/* ADAPTASI SENSORI BADGES (TUNA METRICS) */}
                      <div className="mb-4 pt-3 border-t border-slate-100 dark:border-yellow-400/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[11px] font-bold uppercase tracking-wider ${highContrast ? 'text-yellow-300' : 'text-slate-500'}`}>
                            Fitur Aksesibilitas Terpasang:
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveModalCourse(courseWithMedia)}
                            className={`text-[11px] font-bold flex items-center gap-1 underline ${
                              highContrast ? 'text-yellow-300' : 'text-blue-600 hover:text-blue-700'
                            }`}
                          >
                            <Info className="w-3 h-3" />
                            <span>Cek Kesesuaian Tuna</span>
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                              highContrast
                                ? 'border-yellow-400 text-yellow-300'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            <Subtitles className="w-3 h-3 text-emerald-600" />
                            <span>Takarir CC (Rungu)</span>
                          </span>

                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                              highContrast
                                ? 'border-yellow-400 text-yellow-300'
                                : 'bg-purple-50 text-purple-800 border-purple-200'
                            }`}
                          >
                            <UserCheck className="w-3 h-3 text-purple-600" />
                            <span>Video JBI (Rungu)</span>
                          </span>

                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                              highContrast
                                ? 'border-yellow-400 text-yellow-300'
                                : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                            }`}
                          >
                            <MousePointerClick className="w-3 h-3 text-indigo-600" />
                            <span>Ramah Sentuh (Wicara)</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="p-4 sm:p-6 pt-0 border-t border-slate-100 dark:border-yellow-400/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                    <Link
                      to={`/course?id=${course.id}`}
                      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition active:scale-95 flex-1 ${
                        highContrast
                          ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                          : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                      aria-label={`Tonton video materi ${course.title}`}
                    >
                      <Play className="w-4 h-4 fill-current shrink-0" aria-hidden="true" />
                      <span>Tonton Video Tutorial</span>
                      <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                    </Link>

                    <Link
                      to={`/course?id=${course.id}&tab=accounting`}
                      className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition shrink-0 ${
                        highContrast
                          ? 'border-yellow-400 text-yellow-300 hover:bg-yellow-950'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                      aria-label={`Hitung harga jual untuk ${course.title}`}
                    >
                      <Calculator className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>Hitung Harga Jual</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MODAL / POPUP: DETAIL KESESUAIAN TUNA */}
        {activeModalCourse && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-course-title"
          >
            <div
              className={`w-full max-w-2xl rounded-3xl p-6 sm:p-8 border-2 shadow-2xl overflow-y-auto max-h-[90vh] ${
                highContrast
                  ? 'bg-black border-yellow-400 text-yellow-300'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span
                    className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded ${
                      highContrast ? 'bg-yellow-400 text-black' : 'bg-blue-100 text-blue-900'
                    }`}
                  >
                    Kesesuaian Adaptif Ragam Disabilitas
                  </span>
                  <h3 id="modal-course-title" className="text-xl sm:text-2xl font-black mt-2">
                    {activeModalCourse.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Bagaimana konten video tutorial ini disesuaikan dengan kebutuhan Tunarungu dan Tunawicara:
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModalCourse(null)}
                  className={`p-2 rounded-xl border text-sm font-bold ${
                    highContrast
                      ? 'border-yellow-400 text-yellow-300 hover:bg-yellow-950'
                      : 'border-slate-300 text-slate-500 hover:bg-slate-100'
                  }`}
                  aria-label="Tutup jendela penjelasan adaptasi tuna"
                >
                  ✕
                </button>
              </div>

              {/* 2 Cards for Tunarungu & Tunawicara */}
              <div className="space-y-3.5 my-6 text-xs sm:text-sm">
                {/* 1. Tunarungu */}
                <div
                  className={`p-4 rounded-2xl border ${
                    highContrast
                      ? 'border-yellow-400/60 bg-yellow-950/20'
                      : 'border-emerald-200 bg-emerald-50/60'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5 font-black text-emerald-800 dark:text-yellow-300">
                    <Ear className="w-4 h-4 text-emerald-600" />
                    <span>1. Tunarungu (Tuli / Gangguan Pendengaran)</span>
                  </div>
                  <p className="text-slate-700 dark:text-yellow-200 leading-relaxed">
                    <strong>Penyesuaian Konten:</strong> {activeModalCourse.sensoryHighlights?.rungu || 'Seluruh ucapan instruktur diterjemahkan ke Takarir Teks (Closed Caption) sinkron per detik, didampingi video Juru Bahasa Isyarat (JBI BISINDO) di jendela PiP.'}
                  </p>
                  <div className="mt-2 text-[11px] text-slate-500 dark:text-yellow-400/80">
                    ✓ Takarir CC besar di layar • Jendela PiP penerjemah BISINDO • Daftar bahan & langkah tertulis lengkap.
                  </div>
                </div>

                {/* 2. Tunawicara */}
                <div
                  className={`p-4 rounded-2xl border ${
                    highContrast
                      ? 'border-yellow-400/60 bg-yellow-950/20'
                      : 'border-purple-200 bg-purple-50/60'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5 font-black text-purple-800 dark:text-yellow-300">
                    <MousePointerClick className="w-4 h-4 text-purple-600" />
                    <span>2. Tunawicara (Gangguan Bicara)</span>
                  </div>
                  <p className="text-slate-700 dark:text-yellow-200 leading-relaxed">
                    <strong>Penyesuaian Konten:</strong> {activeModalCourse.sensoryHighlights?.wicara || 'Seluruh alur belajar dan kalkulator keuangan berbasis sentuhan murni tanpa tes atau input suara.'}
                  </p>
                  <div className="mt-2 text-[11px] text-slate-500 dark:text-yellow-400/80">
                    ✓ 100% Non-verbal • Tombol stepper angka (+/-) • Evaluasi berbasis praktik mandiri.
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-yellow-400/30">
                <button
                  type="button"
                  onClick={() => setActiveModalCourse(null)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold border ${
                    highContrast
                      ? 'border-yellow-400 text-yellow-300'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Tutup
                </button>
                <Link
                  to={`/course?id=${activeModalCourse.id}`}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition ${
                    highContrast
                      ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  Buka & Putar Video Kelas
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCatalog;
