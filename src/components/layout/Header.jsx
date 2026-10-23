import React, { useState, useEffect } from 'react';
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
  LogIn,
  Menu,
  X,
  Ear,
  MousePointerClick
} from 'lucide-react';

const Header = () => {
  const { highContrast } = useA11y();
  const { currentUser, isLoggedIn, isAdmin, isStudent, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  const handleLogout = () => {
    setMobileMenuOpen(false);
    logout();
    navigate('/');
  };

  // Di halaman dashboard admin (/admin), gunakan layout SaaS independen yang bersih
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  // Nav links depend on authentication role
  let navLinks = [];

  if (!isLoggedIn) {
    navLinks = [
      { path: '/', label: 'Beranda', icon: Home },
    ];
  } else if (isStudent) {
    navLinks = [
      { path: '/dashboard', label: 'Ruang Belajarku', icon: Home },
      { path: '/courses', label: 'Katalog Kelas', icon: Layers },
      { path: '/course?id=lilin-aromaterapi&tab=accounting', label: 'Kalkulator Harga Jual', icon: Calculator },
    ];
  } else if (isAdmin) {
    navLinks = [
      { path: '/admin', label: 'Dashboard Admin', icon: Shield },
      { path: '/courses', label: 'Katalog Kelas', icon: Layers },
      { path: '/course?id=lilin-aromaterapi&tab=accounting', label: 'Kalkulator Harga Jual', icon: Calculator },
    ];
  }

  const sensoryLabel = currentUser?.sensoryProfile === 'wicara' ? 'Tunawicara' : 'Tunarungu';
  const SensoryIcon = currentUser?.sensoryProfile === 'wicara' ? MousePointerClick : Ear;

  return (
    <header
      role="banner"
      className={`w-full max-w-full border-b sticky top-0 z-40 backdrop-blur-md transition-colors ${
        highContrast
          ? 'bg-black border-yellow-400 text-yellow-300'
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      {/* Skip Link (Tersembunyi total, muncul jika ditekan Tab oleh pengguna keyboard) */}
      <a href="#main-content" className="skip-link sr-only focus:not-sr-only">
        Loncat ke Konten Utama (Skip to Content)
      </a>

      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-18 md:h-20 flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand / Logo */}
        <Link
          to={isLoggedIn ? (isAdmin ? '/admin' : '/dashboard') : '/'}
          className="flex items-center gap-2 sm:gap-2.5 group focus:outline-none shrink-0"
          aria-label="SENSORIA Beranda, kembali ke halaman utama"
        >
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-base sm:text-lg shadow-sm transition-transform group-hover:scale-105 shrink-0 ${
              highContrast
                ? 'bg-yellow-400 text-black border-2 border-yellow-300'
                : 'bg-blue-600 text-white'
            }`}
          >
            S
          </div>
          <div className="flex items-center">
            <span className={`text-base sm:text-xl md:text-2xl font-black tracking-tight ${highContrast ? 'text-yellow-400' : 'text-slate-900'}`}>
              SENSORIA
            </span>
            <p className={`text-[11px] sm:text-xs ml-2 ${highContrast ? 'text-yellow-200' : 'text-slate-500'} hidden lg:block`}>
              • Media Pembelajaran Adaptif Multisensori
            </p>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION (MD & ABOVE) */}
        <div className="hidden md:flex items-center gap-3">
          <nav aria-label="Navigasi Utama" className="flex items-center gap-1.5">
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
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
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
                  <span>{link.label}</span>
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
                className={`text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 ${
                  highContrast
                    ? 'bg-yellow-950 text-yellow-300 border border-yellow-400'
                    : 'bg-slate-100 text-slate-800'
                }`}
                title={`Masuk sebagai ${currentUser.name}`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="max-w-[120px] truncate">{currentUser.name}</span>
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
                <span>Keluar</span>
              </button>
            </div>
          )}
        </div>

        {/* MOBILE NAVIGATION BAR & TOGGLE (BELOW MD) */}
        <div className="flex md:hidden items-center gap-1.5 shrink-0">
          {!isLoggedIn ? (
            <Link
              to="/login"
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs shadow-sm transition shrink-0 ${
                highContrast
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                  : 'bg-blue-600 text-white hover:bg-blue-500'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 shrink-0" />
              <span>Masuk</span>
            </Link>
          ) : (
            <>
              {/* Quick user avatar circle */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  highContrast
                    ? 'bg-yellow-400 text-black'
                    : 'bg-blue-100 text-blue-700 font-bold'
                }`}
                title={currentUser.name}
              >
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>

              {/* Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-1.5 rounded-xl border transition shrink-0 ${
                  highContrast
                    ? 'border-yellow-400 text-yellow-300 hover:bg-yellow-950'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* MOBILE DRAWER ACCORDION */}
      {isLoggedIn && mobileMenuOpen && (
        <div
          className={`md:hidden border-t px-4 py-4 space-y-3 transition-all ${
            highContrast
              ? 'bg-black border-yellow-400/80 text-yellow-300'
              : 'bg-white border-slate-200 text-slate-900 shadow-lg'
          }`}
        >
          {/* User info card */}
          <div
            className={`p-3 rounded-xl border flex items-center justify-between ${
              highContrast
                ? 'bg-yellow-950/40 border-yellow-400/50'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-xs sm:text-sm truncate">{currentUser.name}</p>
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <SensoryIcon className="w-3 h-3 text-blue-600" />
                  <span>{sensoryLabel}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50 flex items-center gap-1 shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>

          {/* Links list */}
          <nav aria-label="Menu Mobile" className="space-y-1">
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
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-xl font-bold text-xs sm:text-sm transition ${
                    isActive
                      ? highContrast
                        ? 'bg-yellow-400 text-black font-black'
                        : 'bg-blue-600 text-white'
                      : highContrast
                      ? 'text-yellow-300 hover:bg-yellow-950'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
