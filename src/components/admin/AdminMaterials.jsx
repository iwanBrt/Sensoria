import React, { useState } from 'react';
import { useA11y } from '../../context/A11yContext';
import { PlusCircle, Trash2, Tag, Calculator } from 'lucide-react';

const AdminMaterials = ({ materials, onSaveMaterial, onDeleteMaterial }) => {
  const { highContrast } = useA11y();
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('kg');
  const [cost, setCost] = useState(15000);
  const [category, setCategory] = useState('Lilin');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMaterial = {
      id: `mat-${Date.now()}`,
      name: name.trim(),
      unit,
      cost: Number(cost),
      category,
    };

    onSaveMaterial(newMaterial);
    setName('');
    setCost(15000);
  };

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Master Bahan Baku</h2>
          <p className="text-xs text-slate-500">
            Harga acuan bahan baku untuk perhitungan kalkulator laba rugi siswa
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Tambah Bahan Baru */}
        <form
          onSubmit={handleSubmit}
          className={`p-6 rounded-2xl border-2 transition h-fit ${
            highContrast
              ? 'bg-black border-yellow-400 text-yellow-300'
              : 'bg-white border-slate-200 text-slate-900 shadow-sm'
          }`}
        >
          <h3 className="font-black text-base mb-4 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-600" />
            <span>Tambah Bahan Baku Baru</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                Nama Bahan Baku:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Pewarna Lilin Alami"
                className={`w-full p-2.5 rounded-xl border text-sm font-semibold transition ${
                  highContrast
                    ? 'bg-black border-yellow-400 text-yellow-300'
                    : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                  Kategori:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border text-sm font-semibold transition ${
                    highContrast
                      ? 'bg-black border-yellow-400 text-yellow-300'
                      : 'bg-slate-50 border-slate-300'
                  }`}
                >
                  <option value="Lilin">Lilin</option>
                  <option value="Sabun">Sabun</option>
                  <option value="Tata Boga">Tata Boga</option>
                  <option value="Anyaman">Anyaman</option>
                  <option value="Wadah">Wadah/Kemasan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                  Satuan:
                </label>
                <input
                  type="text"
                  required
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="kg / botol / pack"
                  className={`w-full p-2.5 rounded-xl border text-sm font-semibold transition ${
                    highContrast
                      ? 'bg-black border-yellow-400 text-yellow-300'
                      : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                Biaya Modal Satuan (Rp):
              </label>
              <input
                type="number"
                min="0"
                step="500"
                required
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-sm font-semibold transition ${
                  highContrast
                    ? 'bg-black border-yellow-400 text-yellow-300'
                    : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm shadow transition ${
                highContrast
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                  : 'bg-blue-600 text-white hover:bg-blue-500'
              }`}
            >
              Simpan ke Master Bahan
            </button>
          </div>
        </form>

        {/* Tabel Daftar Bahan Baku */}
        <div
          className={`lg:col-span-2 p-6 rounded-2xl border-2 transition ${
            highContrast
              ? 'bg-black border-yellow-400 text-yellow-300'
              : 'bg-white border-slate-200 text-slate-900 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-base flex items-center gap-2">
              <Tag className="w-5 h-5 text-amber-500" />
              <span>Daftar Bahan Baku ({materials.length} Item)</span>
            </h3>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-yellow-400/20">
            {materials.map((item) => (
              <div
                key={item.id}
                className="py-3 flex items-center justify-between gap-4 text-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{item.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-yellow-950 font-semibold text-slate-600 dark:text-yellow-300">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">Satuan: per {item.unit}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-sm text-blue-600 dark:text-yellow-300">
                    {formatRupiah(item.cost)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onDeleteMaterial(item.id, item.name)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                    title="Hapus bahan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMaterials;
