import React, { useState, useEffect } from 'react';
import { useA11y } from '../../context/A11yContext';
import ProfitResult from './ProfitResult';
import { Calculator, Plus, Minus, RotateCcw, Lightbulb } from 'lucide-react';

const CostCalculator = ({
  courseTitle = 'Lilin Aromaterapi',
  defaultModal = 15000,
  defaultPrice = 35000,
}) => {
  const { highContrast, speak, announce } = useA11y();

  const [modal, setModal] = useState(defaultModal);
  const [sellingPrice, setSellingPrice] = useState(defaultPrice);
  const [calculated, setCalculated] = useState(false);

  // Update when props change (e.g. switching courses)
  useEffect(() => {
    setModal(defaultModal);
    setSellingPrice(defaultPrice);
    setCalculated(false);
  }, [defaultModal, defaultPrice]);

  // Preset scenarios across various vocational crafts
  const presets = [
    { name: 'Lilin Aromaterapi', modal: 15000, price: 35000 },
    { name: 'Sabun Herbal Nabati', modal: 12000, price: 28000 },
    { name: 'Kue Kering Cokelat', modal: 20000, price: 45000 },
    { name: 'Tatakan Gelas Anyaman', modal: 10000, price: 25000 },
  ];

  const handleCalculate = (e) => {
    if (e) e.preventDefault();
    setCalculated(true);
    const profit = sellingPrice - modal;
    announce(`Hasil perhitungan: Keuntungan bersih adalah ${profit} rupiah.`);
  };

  const handleReset = () => {
    setModal(defaultModal);
    setSellingPrice(defaultPrice);
    setCalculated(false);
    announce('Kalkulator diatur ulang ke angka awal.');
  };

  const applyPreset = (preset) => {
    setModal(preset.modal);
    setSellingPrice(preset.price);
    setCalculated(true);
    announce(`Contoh dipilih: ${preset.name}. Modal Rp ${preset.modal}, Harga jual Rp ${preset.price}.`);
  };

  const adjustModal = (delta) => {
    setModal((prev) => Math.max(0, prev + delta));
  };

  const adjustSellingPrice = (delta) => {
    setSellingPrice((prev) => Math.max(0, prev + delta));
  };

  const profit = sellingPrice - modal;

  return (
    <div className="w-full">
      {/* Header Info */}
      <div className="mb-6">
        <h2 className={`text-2xl sm:text-3xl font-black ${highContrast ? 'text-yellow-400' : 'text-slate-900'}`}>
          Kalkulator Modal & Keuntungan Usaha
        </h2>
        <p className={`text-base sm:text-lg mt-1 ${highContrast ? 'text-yellow-200' : 'text-slate-600'}`}>
          Perhitungan untuk: <strong className="underline">{courseTitle}</strong>. Masukkan biaya bahan baku dan harga jual produkmu.
        </p>
      </div>

      {/* Quick Example Presets (For Tap Interaction without Typing) */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-amber-500" aria-hidden="true" />
          <span className={`font-bold text-xs uppercase tracking-wider ${highContrast ? 'text-yellow-300' : 'text-slate-700'}`}>
            Pilihan Produk Praktik Cepat:
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {presets.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPreset(p)}
              className={`p-3 rounded-xl border text-left transition transform hover:-translate-y-0.5 active:scale-95 ${
                highContrast
                  ? 'border-yellow-400 bg-black text-yellow-300 hover:bg-yellow-950'
                  : 'border-slate-200 bg-white hover:border-blue-400 text-slate-800 shadow-sm'
              }`}
            >
              <span className="font-bold text-xs sm:text-sm block">{p.name}</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Modal: Rp {p.modal.toLocaleString('id-ID')}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Form Input vs Output Box */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Form */}
        <form
          onSubmit={handleCalculate}
          className={`p-6 sm:p-8 rounded-2xl border-2 shadow-sm transition ${
            highContrast
              ? 'bg-black border-yellow-400 text-yellow-300'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
          aria-label="Formulir Biaya Usaha"
        >
          {/* Field 1: Total Biaya Bahan (Modal) */}
          <div className="mb-6">
            <label
              htmlFor="modal-input"
              className={`block text-base font-bold mb-1 ${
                highContrast ? 'text-yellow-400' : 'text-slate-900'
              }`}
            >
              1. Biaya Bahan Baku (Modal):
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Total pengeluaran untuk membeli bahan pembuatan produk.
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustModal(-5000)}
                className={`p-3 rounded-xl border font-bold transition flex items-center justify-center min-w-[48px] min-h-[48px] ${
                  highContrast
                    ? 'border-yellow-400 bg-black text-yellow-300 hover:bg-yellow-950'
                    : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
                aria-label="Kurangi modal 5000 rupiah"
              >
                <Minus className="w-5 h-5" aria-hidden="true" />
              </button>

              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-base">
                  Rp
                </span>
                <input
                  id="modal-input"
                  type="number"
                  min="0"
                  step="1000"
                  value={modal}
                  onChange={(e) => {
                    setModal(Number(e.target.value) || 0);
                    setCalculated(false);
                  }}
                  className={`w-full pl-12 pr-4 py-3 text-xl font-bold rounded-xl border-2 transition ${
                    highContrast
                      ? 'border-yellow-400 bg-black text-yellow-300 focus:ring-4 focus:ring-yellow-400'
                      : 'border-slate-300 bg-slate-50 text-slate-950 focus:border-blue-600 focus:ring-4 focus:ring-blue-100'
                  }`}
                  aria-describedby="modal-help"
                  required
                />
              </div>

              <button
                type="button"
                onClick={() => adjustModal(5000)}
                className={`p-3 rounded-xl border font-bold transition flex items-center justify-center min-w-[48px] min-h-[48px] ${
                  highContrast
                    ? 'border-yellow-400 bg-black text-yellow-300 hover:bg-yellow-950'
                    : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
                aria-label="Tambah modal 5000 rupiah"
              >
                <Plus className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <span id="modal-help" className="sr-only">
              Masukkan total modal pembuatan produk dalam rupiah
            </span>
          </div>

          {/* Field 2: Harga Jual Produk */}
          <div className="mb-8">
            <label
              htmlFor="selling-price-input"
              className={`block text-base font-bold mb-1 ${
                highContrast ? 'text-yellow-400' : 'text-slate-900'
              }`}
            >
              2. Harga Jual Produk ke Pembeli:
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Harga saat produk ditawarkan kepada konsumen.
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustSellingPrice(-5000)}
                className={`p-3 rounded-xl border font-bold transition flex items-center justify-center min-w-[48px] min-h-[48px] ${
                  highContrast
                    ? 'border-yellow-400 bg-black text-yellow-300 hover:bg-yellow-950'
                    : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
                aria-label="Kurangi harga jual 5000 rupiah"
              >
                <Minus className="w-5 h-5" aria-hidden="true" />
              </button>

              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-base">
                  Rp
                </span>
                <input
                  id="selling-price-input"
                  type="number"
                  min="0"
                  step="1000"
                  value={sellingPrice}
                  onChange={(e) => {
                    setSellingPrice(Number(e.target.value) || 0);
                    setCalculated(false);
                  }}
                  className={`w-full pl-12 pr-4 py-3 text-xl font-bold rounded-xl border-2 transition ${
                    highContrast
                      ? 'border-yellow-400 bg-black text-yellow-300 focus:ring-4 focus:ring-yellow-400'
                      : 'border-slate-300 bg-slate-50 text-slate-950 focus:border-blue-600 focus:ring-4 focus:ring-blue-100'
                  }`}
                  aria-describedby="selling-help"
                  required
                />
              </div>

              <button
                type="button"
                onClick={() => adjustSellingPrice(5000)}
                className={`p-3 rounded-xl border font-bold transition flex items-center justify-center min-w-[48px] min-h-[48px] ${
                  highContrast
                    ? 'border-yellow-400 bg-black text-yellow-300 hover:bg-yellow-950'
                    : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
                aria-label="Tambah harga jual 5000 rupiah"
              >
                <Plus className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <span id="selling-help" className="sr-only">
              Masukkan harga jual produk dalam rupiah
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              className={`w-full sm:flex-1 py-3.5 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow transition active:scale-95 ${
                highContrast
                  ? 'bg-yellow-400 text-black border-2 border-yellow-300 hover:bg-yellow-300'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              <Calculator className="w-5 h-5" aria-hidden="true" />
              <span>Hitung Keuntungan</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className={`p-3.5 rounded-xl border transition flex items-center justify-center ${
                highContrast
                  ? 'border-yellow-400 text-yellow-300 hover:bg-yellow-950'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
              title="Atur ulang nilai"
              aria-label="Reset formulir"
            >
              <RotateCcw className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </form>

        {/* Output Section */}
        <div>
          <ProfitResult
            profit={profit}
            modal={modal}
            sellingPrice={sellingPrice}
            calculated={calculated}
          />
        </div>
      </div>
    </div>
  );
};

export default CostCalculator;
