import React, { useState } from 'react';
import { useA11y } from '../../context/A11yContext';
import {
  ArrowUpRight,
  Calendar,
  ChevronDown,
  Check,
  User,
  Layers,
  Users,
  Subtitles,
  Tag
} from 'lucide-react';

const AdminOverview = ({ stats, courses, onNavigateTab }) => {
  const { highContrast } = useA11y();
  const [selectedMonth, setSelectedMonth] = useState('Oktober 2026');

  // Activity bar chart data (8 periods)
  const chartData = [
    { label: '1 Okt', value: 75, height: '75%' },
    { label: '5 Okt', value: 45, height: '45%' },
    { label: '9 Okt', value: 58, height: '58%', highlight: true, tooltip: '14 Sesi' },
    { label: '13 Okt', value: 50, height: '50%' },
    { label: '17 Okt', value: 65, height: '65%' },
    { label: '21 Okt', value: 85, height: '85%' },
    { label: '25 Okt', value: 92, height: '92%' },
    { label: '29 Okt', value: 78, height: '78%' },
  ];

  // Disability distribution for Donut Chart
  const disabilityStats = [
    { name: 'Tunarungu (Takarir CC & JBI)', count: 3, percent: 60, color: '#10b981' },
    { name: 'Tunawicara (Navigasi Sentuh)', count: 2, percent: 40, color: '#5b32f5' },
  ];

  return (
    <div className="space-y-5">
      {/* 1. CLEAN MINIMAL HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Ringkasan</h1>
          <p className="text-xs text-slate-500">Statistik aktivitas vokasi dan data siswa SENSORIA</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-sm">
            <span>{selectedMonth}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
            title="Pilih tanggal"
          >
            <Calendar className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. TOP METRICS GRID (4 CARDS: 1 PRIMARY, 3 NEUTRAL) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Modul Vokasi */}
        <div
          onClick={() => onNavigateTab('courses')}
          className="p-4 rounded-xl bg-[#5b32f5] text-white shadow-sm relative overflow-hidden group cursor-pointer transition hover:bg-[#522ce3]"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-white/80">Modul Vokasi</span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight">{stats.totalCourses}</span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/20 text-white">
              Aktif
            </span>
          </div>
          <p className="text-[11px] text-white/70 mt-2">Lilin, Sabun, Boga & Kriya</p>
        </div>

        {/* Card 2: Siswa Binaan */}
        <div
          onClick={() => onNavigateTab('students')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm relative group cursor-pointer transition hover:border-slate-300"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Siswa Terdaftar</span>
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-slate-800">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">{stats.totalStudents}</span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              Siswa
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Terdata di database</p>
        </div>

        {/* Card 3: Takarir CC */}
        <div
          onClick={() => onNavigateTab('accessibility')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm relative group cursor-pointer transition hover:border-slate-300"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Takarir & Audio</span>
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-slate-800">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">{stats.totalSubtitles}</span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60">
              Baris CC
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Aksesibel untuk tunarungu</p>
        </div>

        {/* Card 4: Master Bahan */}
        <div
          onClick={() => onNavigateTab('materials')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm relative group cursor-pointer transition hover:border-slate-300"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Master Bahan Baku</span>
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-slate-800">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">{stats.totalMaterials}</span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              Item
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Dukungan kalkulator laba</p>
        </div>
      </div>

      {/* 3. CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Activity Bar Chart */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Aktivitas Belajar Siswa</h2>
                <p className="text-xs text-slate-400">Interaksi video modul & kalkulator laba</p>
              </div>

              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Bar Chart */}
            <div className="relative pt-4 pb-1">
              <div className="absolute inset-x-0 top-4 border-b border-dashed border-slate-100" />
              <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-slate-100" />
              <div className="absolute inset-x-0 bottom-7 border-b border-slate-200" />

              <div className="h-44 flex items-end justify-between gap-1 sm:gap-3 px-1 relative z-10">
                {chartData.map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    {bar.tooltip && (
                      <div className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-900 text-white shadow-sm mb-1">
                        {bar.tooltip}
                      </div>
                    )}

                    <div
                      style={{ height: bar.height }}
                      className={`w-full max-w-[28px] rounded-t-md transition-all ${
                        bar.highlight
                          ? 'bg-[#5b32f5]'
                          : 'bg-[#5b32f5]/75 hover:bg-[#5b32f5]'
                      }`}
                    />

                    <span className="text-[10px] font-medium text-slate-400 mt-1.5">
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2 Mini Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
                <Check className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-slate-900">{stats.totalCourses}</span>
                  <span className="text-xs font-semibold text-slate-700">Modul Vokasi Siap</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Lilin Aromaterapi, Sabun Mandi, Keripik Pisang, & Merajut.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
                <User className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-slate-900">{stats.totalStudents}</span>
                  <span className="text-xs font-semibold text-slate-700">Siswa Aktif</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Terdaftar mandiri dan tersinkron ke database.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Donut Chart */}
        <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Distribusi Ragam Disabilitas</h2>
                <p className="text-xs text-slate-400">Persentase profil sensori siswa</p>
              </div>

              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Donut Chart SVG */}
            <div className="py-4 flex items-center justify-center relative">
              <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" stroke="#f1f5f9" strokeWidth="12" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#5b32f5"
                  strokeWidth="12"
                  strokeDasharray="83.5 238.7"
                  strokeDashoffset="0"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#f97316"
                  strokeWidth="12"
                  strokeDasharray="59.7 238.7"
                  strokeDashoffset="-83.5"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#10b981"
                  strokeWidth="12"
                  strokeDasharray="59.7 238.7"
                  strokeDashoffset="-143.2"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#eab308"
                  strokeWidth="12"
                  strokeDasharray="35.8 238.7"
                  strokeDashoffset="-202.9"
                  fill="none"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-slate-900">{stats.totalStudents}</span>
                <span className="text-[10px] font-medium text-slate-400 uppercase">Siswa</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-100">
            {disabilityStats.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-600 font-medium">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-700">{item.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
