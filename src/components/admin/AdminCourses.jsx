import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useA11y } from '../../context/A11yContext';
import { PlusCircle, Edit3, Trash2, ExternalLink, Check, X } from 'lucide-react';

const AdminCourses = ({ courses, onSaveCourse, onDeleteCourse }) => {
  const { highContrast } = useA11y();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    category: 'Kriya & Kerajinan',
    durationText: '4 Langkah • 15 Menit',
    defaultModal: 15000,
    defaultPrice: 35000,
    description: '',
  });

  const handleStartCreate = () => {
    setFormData({
      title: '',
      category: 'Kriya & Kerajinan',
      durationText: '4 Langkah • 20 Menit',
      defaultModal: 15000,
      defaultPrice: 35000,
      description: '',
    });
    setEditingId(null);
    setIsEditing(true);
  };

  const handleStartEdit = (course) => {
    setFormData({
      title: course.title,
      category: course.category,
      durationText: course.durationText || '4 Langkah',
      defaultModal: course.defaultModal || 15000,
      defaultPrice: course.defaultPrice || 35000,
      description: course.description || '',
    });
    setEditingId(course.id);
    setIsEditing(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const courseId = editingId || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const existingCourse = courses.find((c) => c.id === courseId);

    const payload = {
      id: courseId,
      title: formData.title,
      category: formData.category,
      durationText: formData.durationText,
      defaultModal: Number(formData.defaultModal),
      defaultPrice: Number(formData.defaultPrice),
      description: formData.description,
      steps: existingCourse?.steps || [
        {
          id: 1,
          title: '1. Persiapan Bahan Baku',
          duration: 30,
          summary: 'Siapkan peralatan dan bahan sesuai arahan instruktur.',
          audioDescription: 'Instruktur menunjukkan bahan utama di atas meja kerja.',
          materials: ['Bahan baku utama', 'Wadah kerja'],
          subtitles: [{ start: 0, end: 15, text: 'Halo! Mari siapkan bahan sebelum mulai.' }],
        },
      ],
    };

    onSaveCourse(payload);
    setIsEditing(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Modul Vokasi</h2>
          <p className="text-xs text-slate-500">
            Daftar kurikulum video dan panduan praktik mandiri
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={handleStartCreate}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium text-xs text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition"
          >
            <PlusCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Tambah Modul</span>
          </button>
        )}
      </div>

      {/* Course Edit/Create Form */}
      {isEditing && (
        <form
          onSubmit={handleSubmit}
          className={`p-6 sm:p-8 rounded-2xl border-2 transition ${
            highContrast
              ? 'bg-black border-yellow-400 text-yellow-300'
              : 'bg-white border-blue-400 shadow-md text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-yellow-400/30">
            <h3 className="text-lg font-black">
              {editingId ? 'Edit Modul Keterampilan' : 'Tambah Modul Baru'}
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                Judul Modul:
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Contoh: Pembuatan Pot Gerabah Mini"
                className={`w-full p-2.5 rounded-xl border text-sm font-semibold transition ${
                  highContrast
                    ? 'bg-black border-yellow-400 text-yellow-300'
                    : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                Kategori Vokasi:
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`w-full p-2.5 rounded-xl border text-sm font-semibold transition ${
                  highContrast
                    ? 'bg-black border-yellow-400 text-yellow-300'
                    : 'bg-slate-50 border-slate-300'
                }`}
              >
                <option value="Kriya & Kerajinan">Kriya & Kerajinan</option>
                <option value="Kriya & Sanitasi">Kriya & Sanitasi</option>
                <option value="Tata Boga & Kuliner">Tata Boga & Kuliner</option>
                <option value="Kriya Tradisional">Kriya Tradisional</option>
                <option value="Pertanian & Hidroponik">Pertanian & Hidroponik</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                Modal Bahan Bawaan (Rp):
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={formData.defaultModal}
                onChange={(e) => setFormData({ ...formData, defaultModal: e.target.value })}
                className={`w-full p-2.5 rounded-xl border text-sm font-semibold transition ${
                  highContrast
                    ? 'bg-black border-yellow-400 text-yellow-300'
                    : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                Harga Jual Acuan (Rp):
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={formData.defaultPrice}
                onChange={(e) => setFormData({ ...formData, defaultPrice: e.target.value })}
                className={`w-full p-2.5 rounded-xl border text-sm font-semibold transition ${
                  highContrast
                    ? 'bg-black border-yellow-400 text-yellow-300'
                    : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold uppercase tracking-wider mb-1">
              Deskripsi Singkat Pembelajaran:
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Jelaskan keterampilan apa yang akan diperoleh siswa setelah mengikuti modul ini..."
              className={`w-full p-2.5 rounded-xl border text-sm font-semibold transition ${
                highContrast
                  ? 'bg-black border-yellow-400 text-yellow-300'
                  : 'bg-slate-50 border-slate-300'
              }`}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className={`px-5 py-2.5 rounded-xl font-bold text-sm shadow transition ${
                highContrast
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                  : 'bg-blue-600 text-white hover:bg-blue-500'
              }`}
            >
              Simpan Modul
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* Courses List Table/Cards */}
      <div className="grid grid-cols-1 gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className={`p-5 rounded-2xl border-2 transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              highContrast
                ? 'bg-black border-yellow-400 text-yellow-300'
                : 'bg-white border-slate-200 text-slate-900 shadow-sm'
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    highContrast
                      ? 'bg-yellow-950 text-yellow-300 border border-yellow-400'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {course.category}
                </span>
                <span className="text-xs text-slate-500">{course.durationText}</span>
              </div>

              <h3 className="text-lg font-black">{course.title}</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-1">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-4 mt-2.5 text-xs font-semibold">
                <span>Modal Bawaan: Rp {course.defaultModal?.toLocaleString('id-ID')}</span>
                <span>Harga Jual: Rp {course.defaultPrice?.toLocaleString('id-ID')}</span>
                <span className="text-emerald-600 font-bold">
                  {course.steps?.length || 0} Langkah Praktik
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-end md:self-center pt-2 sm:pt-0">
              <Link
                to={`/course?id=${course.id}`}
                target="_blank"
                className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1 ${
                  highContrast
                    ? 'border-yellow-400 text-yellow-300 hover:bg-yellow-950'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
                title="Buka tampilan siswa"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Pratinjau</span>
              </Link>

              <button
                type="button"
                onClick={() => handleStartEdit(course)}
                className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1 ${
                  highContrast
                    ? 'border-yellow-400 text-yellow-300 hover:bg-yellow-950'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
                title="Edit data modul"
              >
                <Edit3 className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>

              <button
                type="button"
                onClick={() => onDeleteCourse(course.id, course.title)}
                className="p-2 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 transition"
                title="Hapus modul ini"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCourses;
