import React from 'react';
import { useA11y } from '../../context/A11yContext';
import { CheckCircle2, ChevronRight, ChevronLeft, Sparkles, Calculator } from 'lucide-react';

const StepNavigation = ({ steps, currentStep, onSelectStep, onGoToAccounting }) => {
  const { highContrast, speak, announce } = useA11y();

  const handleStepClick = (index) => {
    onSelectStep(index);
    announce(`Beralih ke Langkah ${index + 1}: ${steps[index].title}`);
  };

  return (
    <nav aria-label="Navigasi Tahapan Materi Vokasi" className="mt-8">
      {/* Progress header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className={`text-xl font-black ${highContrast ? 'text-yellow-400' : 'text-slate-900'}`}>
            Tahapan Belajar Vokasi
          </h2>
          <p className={`text-sm ${highContrast ? 'text-yellow-200' : 'text-slate-600'}`}>
            Langkah {currentStep + 1} dari {steps.length} materi
          </p>
        </div>

        {/* Action: Jump to Profit/Cost Calculator */}
        <button
          type="button"
          onClick={onGoToAccounting}
          className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-black text-sm sm:text-base shadow-lg transition-transform active:scale-95 ${
            highContrast
              ? 'bg-yellow-400 text-black border-2 border-yellow-300 hover:bg-yellow-300'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
          }`}
          aria-label="Lanjut ke Kalkulator Hitung Untung Usaha"
        >
          <Calculator className="w-5 h-5" aria-hidden="true" />
          <span>Hitung Untung & Modal Usaha</span>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Steps List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isDone = index < currentStep;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => handleStepClick(index)}
              aria-current={isActive ? 'step' : undefined}
              className={`text-left p-4 rounded-xl border-2 transition-all flex flex-col justify-between min-h-[110px] ${
                isActive
                  ? highContrast
                    ? 'bg-black border-yellow-400 text-yellow-300 ring-4 ring-yellow-400/50'
                    : 'bg-blue-50/80 border-blue-600 text-blue-950 ring-2 ring-blue-500/20 shadow-md'
                  : isDone
                  ? highContrast
                    ? 'bg-yellow-950/30 border-yellow-400/70 text-yellow-200'
                    : 'bg-emerald-50/60 border-emerald-400 text-slate-800'
                  : highContrast
                  ? 'bg-black border-slate-700 text-slate-400 hover:border-yellow-400/60'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    isActive
                      ? highContrast
                        ? 'bg-yellow-400 text-black'
                        : 'bg-blue-600 text-white'
                      : isDone
                      ? highContrast
                        ? 'bg-yellow-400 text-black'
                        : 'bg-emerald-600 text-white'
                      : highContrast
                      ? 'bg-slate-800 text-yellow-300'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  Langkah {index + 1}
                </span>

                {isDone && (
                  <CheckCircle2
                    className={`w-5 h-5 ${highContrast ? 'text-yellow-400' : 'text-emerald-600'}`}
                    aria-label="Selesai dipelajari"
                  />
                )}
              </div>

              <span className="font-bold text-sm sm:text-base line-clamp-2 leading-snug">
                {step.title}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default StepNavigation;
