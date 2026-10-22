import React from 'react';
import { useLocation } from 'react-router-dom';
import { useA11y } from '../../context/A11yContext';
import { Heart, Keyboard, ShieldCheck } from 'lucide-react';

const Footer = () => {
  const { highContrast } = useA11y();
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer
      role="contentinfo"
      className={`border-t transition-colors mt-auto py-8 ${
        highContrast
          ? 'bg-black border-yellow-400 text-yellow-300'
          : 'bg-slate-900 border-slate-800 text-slate-300'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <span
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg ${
                highContrast ? 'bg-yellow-400 text-black' : 'bg-blue-600 text-white'
              }`}
            >
              S
            </span>
            <div>
              <h2 className={`text-lg font-black ${highContrast ? 'text-yellow-400' : 'text-white'}`}>
                SENSORIA
              </h2>
              <p className="text-xs text-slate-400">
                Tempat Belajar Keterampilan & Bisnis untuk Anak Hebat
              </p>
            </div>
          </div>

          {/* Quick Keyboard Hint */}
          <div className="flex items-center gap-2 text-xs">
            <Keyboard className="w-4 h-4 text-amber-400" aria-hidden="true" />
            <span className="text-slate-400">Tekan tombol</span>
            <kbd className="px-2 py-0.5 rounded bg-black/60 border border-slate-600 font-mono text-amber-300 font-bold">Tab</kbd>
            <span className="text-slate-400">untuk pindah tombol &</span>
            <kbd className="px-2 py-0.5 rounded bg-black/60 border border-slate-600 font-mono text-amber-300 font-bold">Enter</kbd>
            <span className="text-slate-400">untuk memilih</span>
          </div>

          {/* Accessibility Standard */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border border-yellow-400/20">
            <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>Aksesibilitas WCAG 2.1 AA/AAA</span>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>© 2026 SENSORIA. Belajar Mandiri, Berkarya Inklusif.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan rasa peduli untuk teman-teman disabilitas sensorik.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
