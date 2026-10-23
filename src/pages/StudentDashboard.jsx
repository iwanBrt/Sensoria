import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useA11y } from '../context/A11yContext';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import {
  BookOpen,
  Calculator,
  Ear,
  MousePointerClick,
  ArrowRight,
  LogOut,
  Layers,
  Settings2,
  Play,
  Clock,
  Subtitles,
  UserCheck
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

const StudentDashboard = () => {
  const { highContrast } = useA11y();
  const { currentUser, isStudent, logout, loginAsStudent } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // If not logged in, redirect to landing page
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await dbService.getCourses();
      setCourses(data);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  if (!currentUser) return null;

  const profileBadgeMap = {
    rungu: {
      label: 'Tunarungu (Takarir CC & Video JBI)',
      icon: Ear,
      color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    },
    wicara: {
      label: 'Tunawicara (Navigasi Sentuh Murni)',
      icon: MousePointerClick,
      color: 'bg-purple-100 text-purple-900 border-purple-300',
    },
  };

  const currentBadge = profileBadgeMap[currentUser.sensoryProfile] || profileBadgeMap.rungu;
  const ProfileIcon = currentBadge.icon;

  const handleSwitchProfile = (profileKey) => {
    loginAsStudent(currentUser.name, profileKey);
  };

  return (
    <div className="w-full py-4 sm:py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* =============================================================== */}
        {/* 1. MOBILE GREETING BAR (SIMPLE, COMPACT & NO HEAVY BLUE CARD) */}
        {/* =============================================================== */}
        <div
          className={`sm:hidden mb-4 p-3 rounded-2xl border transition shadow-sm flex items-center justify-between gap-2.5 ${
            highContrast
              ? 'bg-black border-yellow-400 text-yellow-300'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-extrabold truncate text-slate-900 dark:text-inherit">
              Halo, {currentUser.name}! 👋
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <ProfileIcon className="w-3 h-3 text-blue-600 shrink-0" />
              <span className="text-[10px] font-bold text-slate-600 truncate">
                {currentBadge.label.split('(')[0].trim()}
              </span>
            </div>
          </div>

          {/* Compact Sensory Toggle */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-xl shrink-0">
            {Object.keys(profileBadgeMap).map((key) => {
              const isCur = currentUser.sensoryProfile === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSwitchProfile(key)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase transition ${
                    isCur
                      ? highContrast
                        ? 'bg-yellow-400 text-black'
                        : 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {key}
                </button>
              );
            })}
          </div>
        </div>

        {/* =============================================================== */}
        {/* 2. TABLET/DESKTOP RICH BANNER */}
        {/* =============================================================== */}
        <div
          className={`hidden sm:block p-6 sm:p-8 rounded-3xl border-2 transition mb-6 sm:mb-8 ${
            highContrast
              ? 'bg-black border-yellow-400 text-yellow-300'
              : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    highContrast
                      ? 'bg-yellow-400 text-black'
                      : 'bg-white/20 text-white backdrop-blur-sm'
                  }`}
                >
                  <ProfileIcon className="w-3.5 h-3.5 shrink-0" />
                  <span className="leading-tight">{currentBadge.label}</span>
                </span>
              </div>

              <h1 className="text-xl sm:text-3xl md:text-4xl font-black">
                Selamat Datang, {currentUser.name}!
              </h1>
              <p className={`text-xs sm:text-sm md:text-base mt-1 max-w-xl ${highContrast ? 'text-yellow-200' : 'text-blue-100'}`}>
                Ruang belajarmu telah disesuaikan dengan kebutuhan sensori yang kamu pilih. Pilih materi vokasi di bawah untuk mulai berkreasi!
              </p>
            </div>

            {/* Quick Profile Switcher Buttons */}
            <div className="flex flex-col gap-1.5 shrink-0">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${highContrast ? 'text-yellow-300' : 'text-blue-200'}`}>
                Ubah Mode Sensori:
              </span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {Object.keys(profileBadgeMap).map((key) => {
                  const item = profileBadgeMap[key];
                  const isCur = currentUser.sensoryProfile === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleSwitchProfile(key)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                        isCur
                          ? highContrast
                            ? 'bg-yellow-400 text-black border-yellow-300'
                            : 'bg-white text-blue-900 border-white shadow-sm'
                          : highContrast
                          ? 'border-yellow-400/40 text-yellow-300'
                          : 'border-white/30 text-white hover:bg-white/10'
                      }`}
                    >
                      {key.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Link
            to="/courses"
            className={`p-3.5 sm:p-5 rounded-2xl border-2 transition flex items-center justify-between ${
              highContrast
                ? 'bg-black border-yellow-400 text-yellow-300 hover:bg-yellow-950'
                : 'bg-white border-slate-200 hover:border-blue-400 text-slate-900 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm sm:text-base truncate">Katalog Lengkap Semua Kelas</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 truncate">Lihat seluruh modul keterampilan vokasi mandiri</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0 ml-2" />
          </Link>

          <Link
            to="/course?id=lilin-aromaterapi&tab=accounting"
            className={`p-3.5 sm:p-5 rounded-2xl border-2 transition flex items-center justify-between ${
              highContrast
                ? 'bg-black border-yellow-400 text-yellow-300 hover:bg-yellow-950'
                : 'bg-white border-slate-200 hover:border-emerald-400 text-slate-900 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Calculator className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm sm:text-base truncate">Kalkulator Harga Jual & AI</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 truncate">Hitung HPP modal & evaluasi cerdas Gemini</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0 ml-2" />
          </Link>
        </div>

        {/* Available Courses Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black">Materi Praktik Keterampilan Siap Belajar</h2>
              <p className="text-xs sm:text-sm text-slate-500">Pilih salah satu kelas di bawah ini untuk memutar video materi</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400 text-sm">Memuat daftar kelas...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => {
                const media = getCourseMedia(course);
                const thumbnailSrc = (course.thumbnail && !course.thumbnail.includes('be475563bc59')) ? course.thumbnail : media.thumbnail;
                const videoDuration = course.videoDuration || media.duration;
                const currentHighlights = course.sensoryHighlights || media.highlights;

                return (
                  <div
                    key={course.id}
                    className={`group rounded-2xl border-2 overflow-hidden transition-all duration-200 flex flex-col justify-between ${
                      highContrast
                        ? 'bg-black border-yellow-400 text-yellow-300'
                        : 'bg-white border-slate-200 text-slate-900 hover:border-blue-400 hover:shadow-lg'
                    }`}
                  >
                    {/* Video Thumbnail Preview */}
                    <div>
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                        <img
                          src={thumbnailSrc}
                          alt={`Pratinjau video tutorial: ${course.title}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

                        {/* Top Badges */}
                        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2">
                          <span
                            className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded shadow ${
                              highContrast ? 'bg-yellow-400 text-black' : 'bg-blue-600 text-white'
                            }`}
                          >
                            {course.category}
                          </span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-black/75 text-white backdrop-blur-sm border border-white/20 flex items-center gap-1 shadow">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>{videoDuration}</span>
                          </span>
                        </div>

                        {/* Center Play Overlay */}
                        <Link
                          to={`/course?id=${course.id}`}
                          className="absolute inset-0 flex items-center justify-center group/btn"
                          aria-label={`Buka video ${course.title}`}
                        >
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition duration-300 group-hover/btn:scale-110 ${
                              highContrast
                                ? 'bg-yellow-400 text-black ring-4 ring-yellow-400/40'
                                : 'bg-blue-600 text-white ring-4 ring-white/30'
                            }`}
                          >
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </Link>

                        {/* Bottom Tags */}
                        <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between text-white text-[11px]">
                          <span className="bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded font-bold border border-white/10">
                            {course.durationText}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="bg-emerald-600/90 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                              <Subtitles className="w-3 h-3" /> CC
                            </span>
                            <span className="bg-purple-600/90 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                              <UserCheck className="w-3 h-3" /> JBI
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5">
                        <h3 className="text-lg font-black mb-1.5 leading-snug">
                          <Link to={`/course?id=${course.id}`} className="hover:underline">
                            {course.title}
                          </Link>
                        </h3>
                        <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${highContrast ? 'text-yellow-200' : 'text-slate-600'}`}>
                          {course.description}
                        </p>

                        {/* Student specific adaptation note */}
                        {currentUser?.sensoryProfile && currentHighlights?.[currentUser.sensoryProfile] && (
                          <div
                            className={`p-2.5 rounded-xl border text-xs mb-2 flex items-start gap-2 ${
                              highContrast
                                ? 'border-yellow-400/60 bg-yellow-950/20 text-yellow-300'
                                : 'border-blue-100 bg-blue-50/70 text-blue-900'
                            }`}
                          >
                            <span className="font-bold shrink-0">Untuk Ragammu:</span>
                            <span>{currentHighlights[currentUser.sensoryProfile]}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 dark:border-yellow-400/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
                      <Link
                        to={`/course?id=${course.id}`}
                        className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow transition ${
                          highContrast
                            ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Putar Video Praktik</span>
                      </Link>

                      <Link
                        to={`/course?id=${course.id}&tab=accounting`}
                        className={`text-xs font-bold text-center underline px-2 py-1.5 ${
                          highContrast ? 'text-yellow-300' : 'text-slate-700 hover:text-blue-600'
                        }`}
                      >
                        Kalkulator Harga Jual →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
