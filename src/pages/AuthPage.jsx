import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useA11y } from '../context/A11yContext';
import { useAuth } from '../context/AuthContext';
import {
  Headphones,
  Eye,
  Ear,
  MousePointerClick,
  Shield,
  ArrowRight,
  EyeOff,
  Lock,
  Mail,
  User,
  School,
  Volume2,
  Check,
  AlertCircle
} from 'lucide-react';

const SENSORY_MODES = [
  {
    id: 'rungu',
    name: 'Tunarungu (Tuli)',
    summary: 'Takarir Teks CC & JBI Bahasa Isyarat',
    icon: Ear,
  },
  {
    id: 'wicara',
    name: 'Tunawicara (Bisu)',
    summary: '100% Interaksi Sentuh Tanpa Suara',
    icon: MousePointerClick,
  },
];

const AVATARS = [
  { id: 'avatar-1', label: 'Bintang', bg: 'bg-blue-100 text-blue-700', emoji: '🌟' },
  { id: 'avatar-2', label: 'Kreatif', bg: 'bg-amber-100 text-amber-700', emoji: '🎨' },
  { id: 'avatar-3', label: 'Harapan', bg: 'bg-emerald-100 text-emerald-700', emoji: '🌱' },
  { id: 'avatar-4', label: 'Mandiri', bg: 'bg-purple-100 text-purple-700', emoji: '🚀' },
  { id: 'avatar-5', label: 'Juara', bg: 'bg-rose-100 text-rose-700', emoji: '🏆' },
];

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { highContrast, speak, announce } = useA11y();
  const { registerStudent, loginStudentWithCredentials, loginAsAdmin } = useAuth();

  // Tab: 'login' | 'register' | 'admin'
  const getInitialTab = () => {
    if (location.pathname === '/register' || searchParams.get('mode') === 'register') return 'register';
    if (searchParams.get('mode') === 'admin') return 'admin';
    return 'login';
  };
  const [activeTab, setActiveTab] = useState(getInitialTab);

  // Form States
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [school, setSchool] = useState('');
  const [selectedSensory, setSelectedSensory] = useState('rungu');
  const [selectedAvatar, setSelectedAvatar] = useState('avatar-1');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Admin form state
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin123');

  useEffect(() => {
    if (location.pathname === '/register' || searchParams.get('mode') === 'register') {
      setActiveTab('register');
    } else if (searchParams.get('mode') === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('login');
    }
  }, [location.pathname, searchParams]);

  const handlePreviewVoice = (sampleText) => {
    announce(sampleText);
    speak(sampleText);
  };

  // Submit Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Silakan isi nama lengkapmu.');
      return;
    }
    if (!contact.trim()) {
      setErrorMessage('Silakan isi email atau nomor WhatsApp.');
      return;
    }
    if (!password.trim() || password.length < 4) {
      setErrorMessage('Kata sandi minimal 4 karakter.');
      return;
    }

    setLoading(true);

    try {
      await registerStudent({
        name,
        contact,
        password,
        sensoryProfile: selectedSensory,
        school: school || 'SLB Inklusif Mandiri',
        avatar: selectedAvatar,
      });

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });

      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Gagal mendaftar. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!contact.trim()) {
      setErrorMessage('Silakan isi email atau nomor WhatsApp yang terdaftar.');
      return;
    }

    setLoading(true);

    try {
      await loginStudentWithCredentials({
        contact,
        password,
        sensoryProfile: selectedSensory,
      });

      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
      });

      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Gagal masuk. Periksa kembali akun atau kata sandimu.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Admin Login
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminUsername.trim() && adminPassword.trim()) {
      loginAsAdmin(adminUsername);
      navigate('/admin');
    } else {
      setErrorMessage('Username atau password admin belum lengkap.');
    }
  };

  return (
    <div
      className={`min-h-[calc(100vh-5rem)] py-8 sm:py-12 px-4 sm:px-6 flex items-center justify-center transition-colors ${
        highContrast ? 'bg-black text-yellow-300' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className={`w-full ${activeTab === 'register' ? 'max-w-xl' : 'max-w-md'}`}>
        {/* Clean Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3 group focus:outline-none">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base shadow-sm transition ${
                highContrast
                  ? 'bg-yellow-400 text-black border border-yellow-300'
                  : 'bg-slate-900 text-white group-hover:bg-blue-600'
              }`}
            >
              S
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-inherit">
              SENSORIA
            </span>
          </Link>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {activeTab === 'register' && 'Daftar Akun Siswa'}
            {activeTab === 'login' && 'Masuk ke Ruang Belajar'}
            {activeTab === 'admin' && 'Masuk sebagai Instruktur'}
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {activeTab === 'register' && 'Sesuaikan profil kebutuhan sensorikmu untuk materi yang ramah'}
            {activeTab === 'login' && 'Lanjutkan belajar vokasi dan latihan mandiri berwirausaha'}
            {activeTab === 'admin' && 'Panel pengelolaan modul video vokasi, takarir, dan data siswa'}
          </p>

          {/* Minimalist Segmented Control */}
          <div className="mt-5 inline-flex p-1 rounded-xl bg-slate-200/70 border border-slate-200 text-xs font-medium gap-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage('');
              }}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-slate-900 font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Masuk
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMessage('');
              }}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                activeTab === 'register'
                  ? 'bg-white text-slate-900 font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daftar Siswa
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setErrorMessage('');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-white text-slate-900 font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main Card Container */}
        <div
          className={`p-4 sm:p-8 rounded-2xl border transition shadow-sm ${
            highContrast
              ? 'bg-black border-yellow-400'
              : 'bg-white border-slate-200/90'
          }`}
        >
          {/* =================================================================== */}
          {/* 1. FORM LOGIN */}
          {/* =================================================================== */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="login-contact" className="block text-xs font-medium text-slate-700 mb-1">
                  Email atau No. WhatsApp
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="login-contact"
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="nama@email.com atau 08123456789"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="block text-xs font-medium text-slate-700 mb-1">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Mode Sensori Cepat - Responsif & Tidak Terpotong */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Mode Belajar Sensori:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SENSORY_MODES.map((m) => {
                    const Icon = m.icon;
                    const isSelected = selectedSensory === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedSensory(m.id)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition flex items-start gap-2.5 ${
                          isSelected
                            ? 'border-slate-900 bg-slate-900 text-white font-medium shadow-sm'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block font-bold leading-tight">{m.name}</span>
                          <span
                            className={`block text-[10px] leading-tight mt-0.5 ${
                              isSelected ? 'text-white/80' : 'text-slate-500'
                            }`}
                          >
                            {m.summary}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm text-white bg-slate-900 hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>{loading ? 'Memverifikasi...' : 'Masuk ke Ruang Belajar'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500">
                  Belum punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('register');
                      setErrorMessage('');
                    }}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Daftar di sini
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* =================================================================== */}
          {/* 2. FORM REGISTER */}
          {/* =================================================================== */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* KEBUTUHAN SENSORIK */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-700">
                    Pilih Kebutuhan Sensorikmu *
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Otomatis adaptif
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="radiogroup">
                  {SENSORY_MODES.map((mode) => {
                    const Icon = mode.icon;
                    const isSelected = selectedSensory === mode.id;

                    return (
                      <div
                        key={mode.id}
                        onClick={() => setSelectedSensory(mode.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setSelectedSensory(mode.id);
                          }
                        }}
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={0}
                        className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-2.5 ${
                          isSelected
                            ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-slate-900 leading-tight">
                              {mode.name}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-slate-900 flex-shrink-0" />}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            {mode.summary}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AVATAR PROFIL */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Pilih Avatar Karakter:
                </label>
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatar(av.id)}
                      className={`py-2 px-1 rounded-xl border transition flex flex-col items-center gap-1 ${
                        selectedAvatar === av.id
                          ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="text-base sm:text-lg">{av.emoji}</span>
                      <span className="text-[10px] font-medium text-slate-600 truncate w-full text-center">{av.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* BIODATA FORM */}
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Nama */}
                  <div>
                    <label htmlFor="reg-name" className="block text-xs font-medium text-slate-700 mb-1">
                      Nama Lengkap *
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        id="reg-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Budi Santoso"
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  {/* No WhatsApp / Email */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="reg-contact" className="text-xs font-medium text-slate-700">
                        WhatsApp / Email *
                      </label>
                    </div>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        id="reg-contact"
                        type="text"
                        required
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="0812... atau email"
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Password */}
                  <div>
                    <label htmlFor="reg-password" className="block text-xs font-medium text-slate-700 mb-1">
                      Kata Sandi *
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 4 karakter"
                        className="w-full pl-8 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                        title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Asal Sekolah */}
                  <div>
                    <label htmlFor="reg-school" className="block text-xs font-medium text-slate-700 mb-1">
                      Sekolah / SLB (Opsional)
                    </label>
                    <div className="relative">
                      <School className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        id="reg-school"
                        type="text"
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        placeholder="Nama SLB / Komunitas"
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm text-white bg-slate-900 hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>{loading ? 'Menyiapkan...' : 'Daftar & Mulai Belajar'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500">
                  Sudah punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      setErrorMessage('');
                    }}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Masuk di sini
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* =================================================================== */}
          {/* 3. FORM LOGIN ADMIN */}
          {/* =================================================================== */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-700 flex-shrink-0" />
                <span>Panel khusus instruktur & admin pengelolaan modul SENSORIA</span>
              </div>

              <div>
                <label htmlFor="admin-user" className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Pengguna (Username)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="admin-user"
                    type="text"
                    required
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="admin"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="admin-pass" className="block text-xs font-medium text-slate-700 mb-1">
                  Kata Sandi Admin
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="admin-pass"
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="admin123"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm text-white bg-slate-900 hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Shield className="w-4 h-4" />
                  <span>Buka Dashboard Admin</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMessage('');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  ← Kembali ke Masuk Siswa
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
