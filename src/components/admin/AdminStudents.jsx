import React, { useState } from 'react';
import { useA11y } from '../../context/A11yContext';
import {
  Search,
  Download,
  SlidersHorizontal,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Filter
} from 'lucide-react';

const AdminStudents = ({ students, onSaveStudent, onDeleteStudent }) => {
  const { highContrast } = useA11y();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [sensoryProfile, setSensoryProfile] = useState('netra');
  const [school, setSchool] = useState('');
  const [notes, setNotes] = useState('');

  // Counts for each sensory profile
  const netraCount = students.filter((s) => s.sensoryProfile === 'netra').length;
  const kurangAwasCount = students.filter((s) => s.sensoryProfile === 'kurang_awas').length;
  const runguCount = students.filter((s) => s.sensoryProfile === 'rungu').length;
  const wicaraCount = students.filter((s) => s.sensoryProfile === 'wicara').length;

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesProfile = activeFilter === 'all' || s.sensoryProfile === activeFilter;
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.school && s.school.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.contact && s.contact.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesProfile && matchesSearch;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const profileLabels = {
      netra: 'Tunanetra (Mode Suara)',
      kurang_awas: 'Kurang Awas (Kontras Tinggi)',
      rungu: 'Tunarungu (Takarir CC & JBI)',
      wicara: 'Tunawicara (Navigasi Sentuh)',
    };

    const newStudent = {
      id: `std-${Date.now()}`,
      name: name.trim(),
      contact: contact.trim() || '-',
      sensoryProfile,
      profileLabel: profileLabels[sensoryProfile],
      school: school.trim() || 'SLB Mandiri',
      progressSummary: notes.trim() || 'Mendaftar modul baru via admin',
      lastActive: 'Baru saja',
    };

    onSaveStudent(newStudent);
    setName('');
    setContact('');
    setSchool('');
    setNotes('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-4">
      {/* 1. MINIMAL HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Daftar Siswa</h1>
          <p className="text-xs text-slate-500">Data siswa disabilitas dan pemantauan modul vokasi</p>
        </div>
      </div>

      {/* 2. TOP 4 COMPACT SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Blue Stripe (Tunanetra) */}
        <div
          onClick={() => setActiveFilter(activeFilter === 'netra' ? 'all' : 'netra')}
          className={`rounded-xl bg-white border shadow-sm overflow-hidden cursor-pointer transition hover:border-slate-300 ${
            activeFilter === 'netra' ? 'border-[#5b32f5] ring-1 ring-[#5b32f5]' : 'border-slate-200/80'
          }`}
        >
          <div className="h-1 bg-[#5b32f5]" />
          <div className="p-3.5">
            <span className="text-xs font-medium text-slate-500">Tunanetra</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">{netraCount}</span>
              <span className="text-[10px] font-medium text-slate-400">Audio TTS</span>
            </div>
          </div>
        </div>

        {/* Card 2: Orange Stripe (Kurang Awas) */}
        <div
          onClick={() => setActiveFilter(activeFilter === 'kurang_awas' ? 'all' : 'kurang_awas')}
          className={`rounded-xl bg-white border shadow-sm overflow-hidden cursor-pointer transition hover:border-slate-300 ${
            activeFilter === 'kurang_awas' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200/80'
          }`}
        >
          <div className="h-1 bg-orange-500" />
          <div className="p-3.5">
            <span className="text-xs font-medium text-slate-500">Kurang Awas</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">{kurangAwasCount}</span>
              <span className="text-[10px] font-medium text-slate-400">Kontras</span>
            </div>
          </div>
        </div>

        {/* Card 3: Yellow Stripe (Tunarungu) */}
        <div
          onClick={() => setActiveFilter(activeFilter === 'rungu' ? 'all' : 'rungu')}
          className={`rounded-xl bg-white border shadow-sm overflow-hidden cursor-pointer transition hover:border-slate-300 ${
            activeFilter === 'rungu' ? 'border-amber-400 ring-1 ring-amber-400' : 'border-slate-200/80'
          }`}
        >
          <div className="h-1 bg-amber-400" />
          <div className="p-3.5">
            <span className="text-xs font-medium text-slate-500">Tunarungu</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">{runguCount}</span>
              <span className="text-[10px] font-medium text-slate-400">CC & JBI</span>
            </div>
          </div>
        </div>

        {/* Card 4: Green Stripe (Tunawicara) */}
        <div
          onClick={() => setActiveFilter(activeFilter === 'wicara' ? 'all' : 'wicara')}
          className={`rounded-xl bg-white border shadow-sm overflow-hidden cursor-pointer transition hover:border-slate-300 ${
            activeFilter === 'wicara' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200/80'
          }`}
        >
          <div className="h-1 bg-emerald-500" />
          <div className="p-3.5">
            <span className="text-xs font-medium text-slate-500">Tunawicara</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">{wicaraCount}</span>
              <span className="text-[10px] font-medium text-slate-400">Sentuh</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. TOOLBAR CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, sekolah, kontak..."
            className="w-full pl-8 pr-16 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 shadow-sm transition"
          />
          <span className="absolute right-2.5 top-2 text-[10px] font-medium text-slate-400">
            {filteredStudents.length} siswa
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {activeFilter !== 'all' && (
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200 transition"
            >
              <span>Filter: {activeFilter}</span>
              <X className="w-3 h-3" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAdding ? 'Tutup' : 'Tambah Siswa'}</span>
          </button>
        </div>
      </div>

      {/* 4. FORM TAMBAH SISWA (COLLAPSIBLE) */}
      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3 max-w-2xl"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-semibold text-xs text-slate-900">Registrasi Siswa Baru</h3>
            <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">
                Nama Lengkap *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama siswa"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">
                No. WhatsApp / Email
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="0812... / email"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">
                Kategori Disabilitas *
              </label>
              <select
                value={sensoryProfile}
                onChange={(e) => setSensoryProfile(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:border-slate-400"
              >
                <option value="netra">Tunanetra (Mode Suara)</option>
                <option value="kurang_awas">Kurang Awas (Kontras Tinggi)</option>
                <option value="rungu">Tunarungu (Takarir CC & JBI)</option>
                <option value="wicara">Tunawicara (Navigasi Sentuh)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">
                Asal Sekolah / SLB
              </label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="Nama SLB / Komunitas"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Catatan Progres
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Modul yang sedang dipelajari..."
              className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:border-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition"
            >
              Simpan Siswa
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* 5. MINIMAL DATA TABLE */}
      <div className="rounded-xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 bg-slate-50/70">
                <th className="py-2.5 px-3">Nama Siswa</th>
                <th className="py-2.5 px-3">Ragam Sensorik</th>
                <th className="py-2.5 px-3">Asal Sekolah</th>
                <th className="py-2.5 px-3">Kontak</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    Tidak ada data siswa ditemukan.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std, idx) => {
                  const badgeMap = {
                    netra: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100', label: 'Tunanetra' },
                    kurang_awas: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100', label: 'Kurang Awas' },
                    rungu: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-100', label: 'Tunarungu' },
                    wicara: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', label: 'Tunawicara' },
                  };

                  const badge = badgeMap[std.sensoryProfile] || badgeMap.netra;

                  return (
                    <tr key={std.id} className="hover:bg-slate-50/60 transition">
                      {/* Nama */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-semibold text-xs flex-shrink-0">
                            {std.name.charAt(0)}
                          </div>
                          <span className="font-medium text-slate-900">{std.name}</span>
                        </div>
                      </td>

                      {/* Ragam Sensorik */}
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${badge.bg} ${badge.text} ${badge.border}`}>
                          {badge.label}
                        </span>
                      </td>

                      {/* Sekolah */}
                      <td className="py-3 px-3 text-slate-600">
                        {std.school || '-'}
                      </td>

                      {/* Kontak */}
                      <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                        {std.contact || '-'}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Aktif
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => onDeleteStudent(std.id, std.name)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Hapus data siswa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStudents;
