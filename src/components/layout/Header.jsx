import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useA11y } from '../../context/A11yContext';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  Calculator,
  Home,
  Shield,
  Layers,
  User,
  LogOut,
  LogIn
} from 'lucide-react';

const Header = () => {
  const { highContrast } = useA11y();
  const { currentUser, isLoggedIn, isAdmin, isStudent, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Di halaman dashboard admin (/admin), gunakan layout SaaS independen yang bersih sesuai desain referensi
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  // Nav links depend on authentication role
  let navLinks = [];

  if (!isLoggedIn) {
    // When on public landing page: keep internal dashboard hidden!
    navLinks = [
      { path: '/', label: 'Beranda', icon: Home },
    ];
  } else if (isStudent) {
    // Logged in as student
    navLinks = [
      { path: '/dashboard', label: 'Ruang Belajarku', icon: Home },
      { path: '/courses', label: 'Katalog Kelas', icon: Layers },
      { path: '/course?id=lilin-aromaterapi&tab=accounting', label: 'Kalkulator Laba', icon: Calculator },
    ];
  } else if (isAdmin) {
    // Logged in as admin
    navLinks = [
      { path: '/admin', label: 'Dashboard Admin', icon: Shield },
      { path: '/courses', label: 'Katalog Kelas', icon: Layers },
      { path: '/course?id=lilin-aromaterapi&tab=accounting', label: 'Kalkulator Laba', icon: Calculator },
    ];
  }

  return (
    <header
      role="banner"
      className={`border-b sticky top-0 z-40 backdrop-blur-md transition-colors ${
        highContrast
          ? 'bg-black border-yellow-400 text-yellow-300'
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      {/* Skip Link (Tersembunyi total, hanya muncul jika ditekan Tab oleh pengguna keyboard / tunanetra) */}
      <a href="#main-content" className="skip-link sr-only focus:not-sr-only">
        Loncat ke Konten Utama (Skip to Content)
      </a>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link
          to={isLoggedIn ? (isAdmin ? '/admin' : '/dashboard') : '/'}
          className="flex items-center gap-3 group focus:outline-none"
          aria-label="SENSORIA Beranda, kembali ke halaman utama"
        >
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-xl shadow-sm transition-transform group-hover:scale-105 ${
              highContrast
                ? 'bg-yellow-400 text-black border-2 border-yellow-300'
                : 'bg-blue-600 text-white'
            }`}
          >
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xl sm:text-2xl font-black tracking-tight ${highContrast ? 'text-yellow-400' : 'text-slate-900'}`}>
                SENSORIA
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  highContrast
                    ? 'bg-yellow-950 text-yellow-300 border border-yellow-400'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                Inklusif
              </span>
            </div>
            <p className={`text-xs ${highContrast ? 'text-yellow-200' : 'text-slate-500'} hidden sm:block`}>
              Media Pembelajaran Adaptif Multisensori
            </p>
          </div>
        </Link>

        {/* Navigation links & User status */}
        <div className="flex items-center gap-2 sm:gap-3">
          <nav aria-label="Navigasi Utama" className="flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isAccounting = link.path.includes('tab=accounting');
              const isActive = isAccounting
                ? location.search.includes('tab=accounting')
                : location.pathname === link.path && !location.search.includes('tab=accounting');

              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                    isActive
                      ? highContrast
                        ? 'bg-yellow-400 text-black shadow-sm font-black'
                        : 'bg-blue-600 text-white shadow-sm'
                      : highContrast
                      ? 'text-yellow-300 hover:bg-yellow-950/60'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Login button OR User profile & Logout */}
          {!isLoggedIn ? (
            <Link
              to="/login"
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition ${
                highContrast
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                  : 'bg-blue-600 text-white hover:bg-blue-500'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-yellow-400/30">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${
                  highContrast
                    ? 'bg-yellow-950 text-yellow-300 border border-yellow-400'
                    : 'bg-slate-100 text-slate-800'
                }`}
                title={`Masuk sebagai ${currentUser.name}`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="max-w-[100px] truncate">{currentUser.name}</span>
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className={`p-2 rounded-xl text-xs font-bold border transition flex items-center gap-1 ${
                  highContrast
                    ? 'border-yellow-400 text-yellow-300 hover:bg-yellow-950'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
                title="Keluar dari akun"
                aria-label="Keluar dari akun"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Keluar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
