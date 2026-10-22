import React from 'react';
import { useLocation } from 'react-router-dom';
import { useA11y } from '../../context/A11yContext';
import { SunMoon, Volume2, VolumeX, ZoomIn, ZoomOut, Sparkles } from 'lucide-react';

const A11yToolbar = () => {
  const location = useLocation();
  const {
    highContrast,
    fontSize,
    screenReaderAssist,
    toggleHighContrast,
    increaseFontSize,
    decreaseFontSize,
    toggleScreenReaderAssist,
  } = useA11y();

  // Toolbar bantuan belajar dikhususkan untuk anak tuna / siswa di ruang belajar, disembunyikan di dashboard admin
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav
      aria-label="Pengaturan Bantuan Belajar"
      className={`border-b transition-colors px-4 py-2 ${
        highContrast
          ? 'bg-black border-yellow-400 text-yellow-300'
          : 'bg-indigo-950 border-indigo-900 text-white'
      }`}
    >
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-sm">
        {/* Left: Friendly Label */}
        <div className="flex items-center space-x-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-black tracking-wide flex items-center gap-1.5 text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 text-amber-400" aria-hidden="true" />
            Tombol Bantuan Belajar:
          </span>
        </div>

        {/* Right: Accessible Control Buttons */}
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Pengaturan Tampilan dan Suara">
          {/* High Contrast Toggle */}
          <button
            type="button"
            onClick={toggleHighContrast}
            aria-pressed={highContrast}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black transition shadow-sm ${
              highContrast
                ? 'bg-yellow-400 text-black ring-2 ring-yellow-300 hover:bg-yellow-300'
                : 'bg-indigo-800 hover:bg-indigo-700 text-white border border-indigo-700'
            }`}
            title="Ubah warna jadi kontras tinggi hitam dan kuning"
          >
            <SunMoon className="w-4 h-4" aria-hidden="true" />
            <span>Kontras Tinggi: {highContrast ? 'ON' : 'OFF'}</span>
          </button>

          {/* Text Size Control */}
          <div className="flex items-center rounded-xl overflow-hidden border border-indigo-700/80 bg-indigo-900/60 p-0.5">
            <button
              type="button"
              onClick={decreaseFontSize}
              disabled={fontSize === 'normal'}
              className={`px-3 py-1 text-xs sm:text-sm font-black flex items-center gap-1 transition ${
                fontSize === 'normal'
                  ? 'opacity-30 cursor-not-allowed text-slate-400'
                  : highContrast
                  ? 'text-yellow-300 hover:bg-yellow-950'
                  : 'text-white hover:bg-indigo-800'
              }`}
              aria-label="Perkecil Ukuran Huruf (A-)"
              title="Perkecil Ukuran Huruf"
            >
              <ZoomOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span>A-</span>
            </button>

            <span
              className={`px-2 py-0.5 text-xs font-mono font-black ${
                highContrast ? 'text-yellow-300' : 'text-amber-300'
              }`}
              aria-label={`Ukuran teks saat ini: ${fontSize}`}
            >
              {fontSize === 'normal' ? 'Normal' : fontSize === 'large' ? 'Besar' : 'Sangat Besar'}
            </span>

            <button
              type="button"
              onClick={increaseFontSize}
              disabled={fontSize === 'xlarge'}
              className={`px-3 py-1 text-xs sm:text-sm font-black flex items-center gap-1 transition ${
                fontSize === 'xlarge'
                  ? 'opacity-30 cursor-not-allowed text-slate-400'
                  : highContrast
                  ? 'text-yellow-300 hover:bg-yellow-950'
                  : 'text-white hover:bg-indigo-800'
              }`}
              aria-label="Perbesar Ukuran Huruf (A+)"
              title="Perbesar Ukuran Huruf"
            >
              <span>A+</span>
              <ZoomIn className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          {/* Voice Assist Toggle */}
          <button
            type="button"
            onClick={toggleScreenReaderAssist}
            aria-pressed={screenReaderAssist}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black transition shadow-sm ${
              screenReaderAssist
                ? highContrast
                  ? 'bg-yellow-400 text-black ring-2 ring-yellow-300 hover:bg-yellow-300'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Aktifkan bantuan narasi suara saat mengeklik"
          >
            {screenReaderAssist ? (
              <Volume2 className="w-4 h-4" aria-hidden="true" />
            ) : (
              <VolumeX className="w-4 h-4" aria-hidden="true" />
            )}
            <span>Suara: {screenReaderAssist ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default A11yToolbar;
