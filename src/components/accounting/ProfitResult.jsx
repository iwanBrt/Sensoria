import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useA11y } from '../../context/A11yContext';
import { TrendingUp, TrendingDown, MinusCircle, Volume2, HelpCircle } from 'lucide-react';

const ProfitResult = ({ profit, modal, sellingPrice, calculated }) => {
  const { highContrast, speak, announce } = useA11y();

  const isProfit = profit > 0;
  const isLoss = profit < 0;
  const isBreakEven = profit === 0 && calculated;

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Math.abs(number));
  };

  useEffect(() => {
    if (!calculated) return;

    if (isProfit) {
      // Visual celebration animation for Tunarungu (WCAG 1.2.2 visual feedback)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#eab308', '#3b82f6', '#ffffff'],
      });

      const message = `Usaha Anda mendapatkan keuntungan bersih sebesar ${formatRupiah(profit)}.`;
      announce(message);
    } else if (isLoss) {
      const message = `Biaya modal lebih tinggi dari harga jual. Terjadi selisih rugi sebesar ${formatRupiah(profit)}.`;
      announce(message);
    } else if (isBreakEven) {
      const message = `Hasil seimbang atau balik modal. Keuntungan bersih adalah nol rupiah.`;
      announce(message);
    }
  }, [calculated, profit, isProfit, isLoss, isBreakEven, announce]);

  if (!calculated) {
    return (
      <div
        className={`p-8 rounded-2xl border-2 border-dashed text-center flex flex-col items-center justify-center transition ${
          highContrast
            ? 'border-yellow-400 bg-black text-yellow-300'
            : 'border-slate-300 bg-slate-50 text-slate-500'
        }`}
        aria-live="polite"
      >
        <HelpCircle className="w-8 h-8 mb-2 opacity-50" aria-hidden="true" />
        <h4 className="text-base font-bold">Hasil Perhitungan Belum Tersedia</h4>
        <p className="text-xs sm:text-sm max-w-sm mt-1">
          Masukkan biaya modal dan harga jual, lalu tekan tombol "Hitung Keuntungan".
        </p>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-live="assertive"
      aria-label="Hasil Analisis Keuntungan Usaha"
      className={`rounded-2xl border-2 p-6 sm:p-7 transition-all shadow-md ${
        isProfit
          ? highContrast
            ? 'bg-black border-yellow-400 text-yellow-300'
            : 'bg-emerald-50/70 border-emerald-500 text-emerald-950'
          : isLoss
          ? highContrast
            ? 'bg-black border-yellow-400 text-yellow-300'
            : 'bg-rose-50/70 border-rose-500 text-rose-950'
          : highContrast
          ? 'bg-black border-yellow-400 text-yellow-300'
          : 'bg-amber-50/70 border-amber-500 text-amber-950'
      }`}
    >
      {/* Visual Status Badge */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {isProfit && (
            <span
              className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                highContrast ? 'bg-yellow-400 text-black' : 'bg-emerald-600 text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" aria-hidden="true" />
              Status: Untung (Laba)
            </span>
          )}

          {isLoss && (
            <span
              className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                highContrast ? 'bg-yellow-400 text-black' : 'bg-rose-600 text-white'
              }`}
            >
              <TrendingDown className="w-4 h-4" aria-hidden="true" />
              Status: Rugi (Selisih Kurang)
            </span>
          )}

          {isBreakEven && (
            <span
              className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                highContrast ? 'bg-yellow-400 text-black' : 'bg-amber-600 text-white'
              }`}
            >
              <MinusCircle className="w-4 h-4" aria-hidden="true" />
              Status: Balik Modal (Impas)
            </span>
          )}
        </div>

        {/* Read aloud button */}
        <button
          type="button"
          onClick={() => {
            const text = isProfit
              ? `Usaha Anda mendapatkan keuntungan bersih sebesar ${formatRupiah(profit)}.`
              : isLoss
              ? `Anda mengalami selisih rugi sebesar ${formatRupiah(profit)}.`
              : `Hasil seimbang balik modal. Keuntungan adalah nol rupiah.`;
            speak(text);
          }}
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
            highContrast
              ? 'border-yellow-400 text-yellow-300 hover:bg-yellow-950'
              : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800'
          }`}
          aria-label="Dengarkan ulang hasil perhitungan dengan suara"
        >
          <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Bacakan Hasil</span>
        </button>
      </div>

      {/* Main Big Number Display */}
      <div className="my-3">
        <p className="text-xs font-bold uppercase tracking-wider opacity-75">
          {isProfit ? 'Total Keuntungan Bersih:' : isLoss ? 'Total Kerugian:' : 'Keuntungan Bersih:'}
        </p>
        <div
          className={`text-3xl sm:text-4xl font-black tracking-tight my-1.5 ${
            highContrast
              ? 'text-yellow-400 underline'
              : isProfit
              ? 'text-emerald-700'
              : isLoss
              ? 'text-rose-700'
              : 'text-amber-700'
          }`}
        >
          {isLoss ? '-' : '+'} {formatRupiah(profit)}
        </div>
      </div>

      {/* Breakdown Summary */}
      <div
        className={`p-3.5 rounded-xl text-xs sm:text-sm font-medium space-y-2 mt-4 ${
          highContrast ? 'bg-yellow-950/40 border border-yellow-400' : 'bg-white border border-slate-200'
        }`}
      >
        <div className="flex justify-between items-center">
          <span>Harga Jual:</span>
          <span className="font-bold">{formatRupiah(sellingPrice)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Biaya Modal Bahan:</span>
          <span className="font-bold">{formatRupiah(modal)}</span>
        </div>
        <div className="border-t border-slate-200 dark:border-yellow-400/40 pt-1.5 flex justify-between items-center font-bold">
          <span>Hasil Bersih:</span>
          <span>{formatRupiah(profit)}</span>
        </div>
      </div>

      {/* Educational Guidance */}
      <div className="mt-4 p-3 rounded-xl text-xs leading-relaxed border bg-white/50 dark:bg-black/40">
        <p>
          <strong>Catatan Kewirausahaan:</strong>{' '}
          {isProfit ? (
            <span>
              Laba ini dapat dipisahkan menjadi tabungan pribadi dan modal untuk belanja bahan berikutnya.
            </span>
          ) : isLoss ? (
            <span>
              Coba sesuaikan harga jual sedikit lebih tinggi atau cari bahan baku dengan harga lebih hemat.
            </span>
          ) : (
            <span>
              Pendapatan tepat menutup modal. Naikkan sedikit harga jual untuk memperoleh margin keuntungan.
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default ProfitResult;
