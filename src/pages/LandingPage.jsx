import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useA11y } from '../context/A11yContext';
import { useAuth } from '../context/AuthContext';
import {
  Ear,
  MousePointerClick,
  Shield,
  User,
  ArrowRight,
  Lock,
  LogIn,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const LandingPage = () => {
  const { highContrast } = useA11y();
  const { loginAsStudent, loginAsAdmin } = useAuth();
  const navigate = useNavigate();

  // Active Login Role Tab: 'student' | 'admin'
  const [loginRole, setLoginRole] = useState('student');

  // Student Form State
  const [studentName, setStudentName] = useState('');
  const [sensoryProfile, setSensoryProfile] = useState('rungu');

  // Admin Form State
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [adminError, setAdminError] = useState('');

  const sensoryOptions = [
    {
      id: 'rungu',
      title: 'Tunarungu',
      desc: 'Teks takarir (CC) tebal dan jendela juru bahasa isyarat (JBI PiP).',
      icon: Ear,
    },
    {
      id: 'wicara',
      title: 'Tunawicara',
      desc: 'Semua navigasi berbasis tombol ketuk santai tanpa kewajiban bicara.',
      icon: MousePointerClick,
    },
  ];

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    loginAsStudent(studentName || 'Teman Sensoria', sensoryProfile);
    navigate('/dashboard');
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (adminUsername.trim() && adminPassword.trim()) {
      loginAsAdmin(adminUsername);
      navigate('/admin');
    } else {
      setAdminError('Silakan masukkan nama pengguna dan kata sandi.');
    }
  };

  return (
    <div className="w-full">
      {/* 1. HERO SECTION: PENJELASAN TENTANG SENSORIA */}
      <section
        className={`py-8 sm:py-16 md:py-20 border-b transition-colors ${
          highContrast
            ? 'bg-black border-yellow-400 text-yellow-300'
            : 'bg-gradient-to-b from-slate-50 via-blue-50/40 to-white border-slate-200'
        }`}
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span
              className={`inline-block text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full mb-3 sm:mb-4 ${
                highContrast
                  ? 'bg-yellow-400 text-black'
                  : 'bg-blue-100 text-blue-900 border border-blue-200'
              }`}
            >
              Media Pembelajaran Adaptif Multisensori Digital
            </span>

            <h1
              className={`text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-snug sm:leading-tight mb-3 sm:mb-5 ${
                highContrast ? 'text-yellow-400' : 'text-slate-900'
              }`}
            >
              Belajar Keterampilan Vokasi & Mandiri Berwirausaha
            </h1>

            <p
              className={`text-xs sm:text-base md:text-lg leading-relaxed mb-5 sm:mb-6 ${
                highContrast ? 'text-yellow-200' : 'text-slate-600'
              }`}
            >
              <strong>SENSORIA</strong> adalah platform edukasi yang dirancang secara khusus untuk mendampingi teman-teman <strong>Tunarungu dan Tunawicara</strong> dalam mempelajari keterampilan karya nyata sekaligus berlatih menentukan harga jual usaha mandiri.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs sm:text-sm font-semibold opacity-90">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${highContrast ? 'text-yellow-400' : 'text-emerald-600'}`} />
                <span>Video Praktik Vokasi</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${highContrast ? 'text-yellow-400' : 'text-emerald-600'}`} />
                <span>Bahasa Isyarat (JBI) & Takarir</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${highContrast ? 'text-yellow-400' : 'text-emerald-600'}`} />
                <span>Kalkulator HPP Sentuh</span>
              </span>
            </div>

            {/* Single Primary Action Button */}
            <div className="flex items-center justify-center mt-6 sm:mt-8">
              <Link
                to="/login"
                className={`inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl font-black text-xs sm:text-base shadow-xl transition-transform hover:-translate-y-0.5 ${
                  highContrast
                    ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                    : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/30'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk ke Ruang Belajar</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LOGIN FORM SECTION (SISWA & ADMIN) */}
      <section
        id="login-section"
        className={`py-12 sm:py-16 transition-colors ${
          highContrast ? 'bg-black text-yellow-300' : 'bg-slate-50 text-slate-900'
        }`}
        aria-label="Formulir Masuk Pengguna"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`p-6 sm:p-10 rounded-3xl border-2 transition shadow-xl ${
              highContrast
                ? 'bg-black border-yellow-400'
                : 'bg-white border-slate-200 shadow-slate-200/50'
            }`}
          >
            {/* Role Tab Switcher: Siswa vs Admin */}
            <div className="flex border-b border-slate-200 dark:border-yellow-400/30 mb-8 gap-3">
              <button
                type="button"
                onClick={() => setLoginRole('student')}
                className={`flex-1 py-3.5 text-center font-black text-base sm:text-lg border-b-4 transition flex items-center justify-center gap-2 ${
                  loginRole === 'student'
                    ? highContrast
                      ? 'border-yellow-400 text-yellow-300 bg-yellow-950/30'
                      : 'border-blue-600 text-blue-700 bg-blue-50/50'
                    : highContrast
                    ? 'border-transparent text-slate-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
                aria-selected={loginRole === 'student'}
              >
                <User className="w-5 h-5" />
                <span>Masuk sebagai Siswa</span>
              </button>

              <button
                type="button"
                onClick={() => setLoginRole('admin')}
                className={`flex-1 py-3.5 text-center font-black text-base sm:text-lg border-b-4 transition flex items-center justify-center gap-2 ${
                  loginRole === 'admin'
                    ? highContrast
                      ? 'border-yellow-400 text-yellow-300 bg-yellow-950/30'
                      : 'border-blue-600 text-blue-700 bg-blue-50/50'
                    : highContrast
                    ? 'border-transparent text-slate-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
                aria-selected={loginRole === 'admin'}
              >
                <Shield className="w-5 h-5" />
                <span>Masuk sebagai Admin</span>
              </button>
            </div>

            {/* FORM 1: LOGIN SISWA (DENGAN PEMILIH TUNA / SENSIFITAS) */}
            {loginRole === 'student' && (
              <form onSubmit={handleStudentSubmit} className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black mb-1">
                    Halo Teman Hebat! Siapa Namamu?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mb-4">
                    Masukkan namamu dan pilih penyesuaian kebutuhan sensori agar materi otomatis disesuaikan.
                  </p>

                  <label htmlFor="student-name-input" className="block text-xs font-bold uppercase tracking-wider mb-1">
                    Nama Panggilan / Siswa:
                  </label>
                  <input
                    id="student-name-input"
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Contoh: Budi / Siti"
                    className={`w-full p-3.5 text-base sm:text-lg font-bold rounded-xl border-2 transition ${
                      highContrast
                        ? 'bg-black border-yellow-400 text-yellow-300 focus:ring-4 focus:ring-yellow-400'
                        : 'bg-slate-50 border-slate-300 focus:border-blue-600 focus:bg-white'
                    }`}
                  />
                </div>

                {/* Pilih Jenis Tuna / Profil Sensori */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                    Pilih Kebutuhan Sensorikmu:
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Pilih Kategori Sensori">
                    {sensoryOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = sensoryProfile === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => setSensoryProfile(opt.id)}
                          className={`p-4 rounded-2xl border-2 text-left transition transform hover:-translate-y-0.5 active:scale-95 flex items-start gap-3 ${
                            isSelected
                              ? highContrast
                                ? 'bg-yellow-400 text-black border-yellow-300 font-black shadow'
                                : 'bg-blue-50 border-blue-600 text-blue-950 shadow-sm'
                              : highContrast
                              ? 'border-yellow-400/50 bg-black text-yellow-300'
                              : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              isSelected
                                ? highContrast
                                  ? 'bg-black text-yellow-300'
                                  : 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-600 dark:bg-yellow-950'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-sm block">{opt.title}</span>
                            <span className="text-[11px] opacity-80 block mt-0.5 leading-snug">
                              {opt.desc}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-4 px-6 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg transition active:scale-95 ${
                    highContrast
                      ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  <span>Mulai Belajar Sekarang</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            )}

            {/* FORM 2: LOGIN ADMIN / PENGAJAR */}
            {loginRole === 'admin' && (
              <form onSubmit={handleAdminSubmit} className="space-y-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black mb-1">
                    Masuk ke Dashboard Instruktur & Admin
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mb-4">
                    Kelola materi vokasi, takarir CC, juru bahasa isyarat, master harga bahan, dan data siswa.
                  </p>

                  {adminError && (
                    <div className="p-3 mb-4 rounded-xl bg-rose-100 text-rose-800 text-xs font-bold">
                      {adminError}
                    </div>
                  )}

                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                    Nama Pengguna (Username):
                  </label>
                  <input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className={`w-full p-3 text-sm font-bold rounded-xl border transition ${
                      highContrast
                        ? 'bg-black border-yellow-400 text-yellow-300'
                        : 'bg-slate-50 border-slate-300 focus:bg-white'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                    Kata Sandi (Password):
                  </label>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className={`w-full p-3 text-sm font-bold rounded-xl border transition ${
                      highContrast
                        ? 'bg-black border-yellow-400 text-yellow-300'
                        : 'bg-slate-50 border-slate-300 focus:bg-white'
                    }`}
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-100 dark:bg-yellow-950/20 text-xs text-slate-600 dark:text-yellow-300">
                  <p>
                    <strong>Info Akun Uji Coba:</strong> Gunakan username: <code className="font-mono font-bold">admin</code> dan kata sandi: <code className="font-mono font-bold">admin123</code>.
                  </p>
                </div>

                <button
                  type="submit"
                  className={`w-full py-4 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-lg transition active:scale-95 ${
                    highContrast
                      ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Buka Dashboard Admin</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
