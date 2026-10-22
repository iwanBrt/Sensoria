import React, { useState, useEffect, useRef } from 'react';
import { useA11y } from '../../context/A11yContext';
import {
  parseSubtitleFile,
  exportToVTT,
  autoGenerateSubtitles
} from '../../utils/subtitleParser';
import {
  Subtitles,
  Volume2,
  Video,
  Upload,
  Plus,
  Trash2,
  Save,
  Check,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Download,
  FileText,
  Clock,
  Eye,
  UserCheck
} from 'lucide-react';

const AdminAccessibility = ({ courses, onSaveCourse }) => {
  const { highContrast, speak, announce } = useA11y();
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);
  const [saveAlert, setSaveAlert] = useState(false);

  const currentCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const steps = currentCourse?.steps || [];
  const currentStep = steps[selectedStepIndex] || steps[0] || {};

  // Form states for the selected step
  const [audioDescription, setAudioDescription] = useState(currentStep.audioDescription || '');
  const [subtitles, setSubtitles] = useState(currentStep.subtitles || []);
  const [videoUrl, setVideoUrl] = useState(currentStep.videoUrl || '');
  const [videoFileName, setVideoFileName] = useState('');

  // Timeline entry inputs
  const [newSubStart, setNewSubStart] = useState(0);
  const [newSubEnd, setNewSubEnd] = useState(10);
  const [newSubText, setNewSubText] = useState('');

  // Interactive Live Player Simulation State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const timerRef = useRef(null);
  const duration = currentStep.duration || 45;

  // Sync state when course or step changes
  useEffect(() => {
    const targetStep = steps[selectedStepIndex] || {};
    setAudioDescription(targetStep.audioDescription || '');
    setSubtitles(targetStep.subtitles || []);
    setVideoUrl(targetStep.videoUrl || '');
    setCurrentTime(0);
    setIsPlaying(false);
    setNewSubStart(0);
    setNewSubEnd(10);
  }, [selectedCourseId, selectedStepIndex]);

  // Video timer simulation / sync
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return Math.round((prev + 0.5) * 10) / 10;
        });
      }, 500);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, duration]);

  // Find active subtitle at current time
  const currentActiveSubtitle = subtitles.find(
    (sub) => currentTime >= sub.start && currentTime <= sub.end
  )?.text || '';

  // 1. Handle Video Upload (.mp4 / .webm)
  const handleVideoFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setVideoUrl(objectUrl);
      setVideoFileName(file.name);
      announce(`Video ${file.name} berhasil dimuat ke editor.`);
    }
  };

  // 2. Handle Subtitle File Upload (.vtt / .srt)
  const handleSubtitleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        if (typeof content === 'string') {
          const parsed = parseSubtitleFile(content);
          if (parsed.length > 0) {
            setSubtitles(parsed);
            announce(`Berhasil mengimpor ${parsed.length} baris takarir dari file.`);
          } else {
            alert('Format subtitle tidak dikenali. Pastikan file berformat .SRT atau .VTT standar.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  // 3. AI / Auto-Generate Subtitles
  const handleAutoGenerate = () => {
    const generated = autoGenerateSubtitles(
      currentStep.summary || audioDescription || currentStep.title,
      duration
    );
    setSubtitles(generated);
    announce('Takarir otomatis berhasil digenerate dari rangkuman materi!');
  };

  // 4. Download / Export Subtitle as .VTT
  const handleExportVTT = () => {
    const vttContent = exportToVTT(subtitles, `${currentCourse?.title} - Langkah ${selectedStepIndex + 1}`);
    const blob = new Blob([vttContent], { type: 'text/vtt;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `subtitle-langkah-${selectedStepIndex + 1}.vtt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 5. Add Single Subtitle Cue
  const handleAddSubtitle = (e) => {
    e.preventDefault();
    if (!newSubText.trim()) return;

    const newCue = {
      start: Number(newSubStart),
      end: Number(newSubEnd),
      text: newSubText.trim(),
    };

    const updated = [...subtitles, newCue].sort((a, b) => a.start - b.start);
    setSubtitles(updated);
    setNewSubStart(Number(newSubEnd));
    setNewSubEnd(Math.min(Number(newSubEnd) + 10, duration));
    setNewSubText('');
  };

  // 6. Delete Subtitle Cue
  const handleDeleteSubtitle = (index) => {
    setSubtitles(subtitles.filter((_, idx) => idx !== index));
  };

  // 7. Save to Database (Supabase)
  const handleSaveAccessibility = () => {
    const updatedSteps = [...steps];
    updatedSteps[selectedStepIndex] = {
      ...currentStep,
      audioDescription,
      subtitles,
      videoUrl,
    };

    const updatedCourse = {
      ...currentCourse,
      steps: updatedSteps,
    };

    onSaveCourse(updatedCourse);
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Editor Takarir & Video</h2>
          <p className="text-xs text-slate-500">
            Kelola file video, sinkronisasi takarir CC (.srt/.vtt), dan audiodeskripsi modul
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAccessibility}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium text-xs text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Simpan Perubahan</span>
        </button>
      </div>

      {saveAlert && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Takarir dan pengaturan video berhasil disimpan.</span>
        </div>
      )}

      {/* Selectors: Modul & Langkah */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Pilih Modul Vokasi:
          </label>
          <select
            value={selectedCourseId}
            onChange={(e) => {
              setSelectedCourseId(e.target.value);
              setSelectedStepIndex(0);
            }}
            className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Pilih Langkah Tutorial:
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {steps.map((st, idx) => (
              <button
                key={st.id || idx}
                type="button"
                onClick={() => setSelectedStepIndex(idx)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition ${
                  selectedStepIndex === idx
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Langkah {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 1. UPLOAD & LIVE PLAYER PREVIEW AREA */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Video Player Preview with Overlay Subtitle */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-950 text-white shadow-xl relative overflow-hidden">
            {/* Player Screen */}
            <div className="relative aspect-video w-full rounded-2xl bg-slate-900 overflow-hidden flex flex-col items-center justify-center border border-slate-800">
              {/* Actual Video or Visual Canvas */}
              {videoUrl ? (
                <video
                  src={videoUrl}
                  className="w-full h-full object-cover"
                  controls={false}
                  currentTime={currentTime}
                />
              ) : (
                <div className="text-center p-6 space-y-2">
                  <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto text-indigo-400">
                    <Video className="w-8 h-8" />
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-200">
                    {currentStep.title || 'Video Panduan Praktik'}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {currentStep.summary || 'Unggah file video MP4 atau gunakan simulasi player untuk menyinkronkan takarir.'}
                  </p>
                </div>
              )}

              {/* JBI (Sign Language Interpreter) PiP badge preview */}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-bold text-emerald-400 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" />
                <span>JBI PiP Aktif</span>
              </div>

              {/* Live Overlay Subtitle Bar (Floating at bottom of player) */}
              <div className="absolute bottom-4 inset-x-6 z-10 pointer-events-none">
                {currentActiveSubtitle ? (
                  <div className="px-4 py-2.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/20 text-center text-xs sm:text-sm font-black text-yellow-300 shadow-xl max-w-xl mx-auto animate-fade-in">
                    {currentActiveSubtitle}
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 text-center italic">
                    (Subtitle akan tampil di sini saat video diputar)
                  </div>
                )}
              </div>
            </div>

            {/* Video Controls Bar */}
            <div className="mt-4 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-9 h-9 rounded-full bg-[#5b32f5] hover:bg-indigo-600 text-white flex items-center justify-center shadow transition"
                  title={isPlaying ? 'Jeda' : 'Putar'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentTime(0);
                    setIsPlaying(false);
                  }}
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
                  title="Ulang dari awal"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Current Timestamp */}
                <span className="font-mono font-bold text-slate-300 ml-1">
                  {currentTime.toFixed(1)}s / {duration}s
                </span>
              </div>

              {/* Quick Time Sync Buttons for Timing Cues */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setNewSubStart(Math.floor(currentTime))}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-cyan-300 border border-slate-700 transition"
                  title="Gunakan detik pemutar saat ini sebagai waktu mulai"
                >
                  Ambil Mulai ({Math.floor(currentTime)}s)
                </button>

                <button
                  type="button"
                  onClick={() => setNewSubEnd(Math.ceil(currentTime) || 5)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-amber-300 border border-slate-700 transition"
                  title="Gunakan detik pemutar saat ini sebagai waktu selesai"
                >
                  Ambil Selesai ({Math.ceil(currentTime)}s)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Upload Video & Subtitle File Tools */}
        <div className="space-y-4">
          {/* Card: Upload Video File */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-600" />
              <span>Unggah Video Tutorial</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Pilih berkas video dari komputer Anda (.mp4, .webm).
            </p>

            <label className="block border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-4 text-center cursor-pointer transition bg-slate-50/50">
              <Video className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <span className="text-xs font-bold text-indigo-600 block">
                {videoFileName ? videoFileName : 'Pilih Berkas Video (MP4)'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Maksimal 100 MB</span>
              <input
                type="file"
                accept="video/mp4,video/webm"
                onChange={handleVideoFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Card: Import / Export Subtitle (.SRT / .VTT) */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Impor / Ekspor Berkas Takarir</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Sudah punya subtitle dari luar? Unggah file .SRT atau .VTT untuk di-parse otomatis.
            </p>

            <div className="flex flex-col gap-2">
              {/* Import Subtitle Button */}
              <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer transition">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Impor File .SRT atau .VTT</span>
                <input
                  type="file"
                  accept=".srt,.vtt,text/vtt"
                  onChange={handleSubtitleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Auto-Generate AI Button */}
              <button
                type="button"
                onClick={handleAutoGenerate}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border border-indigo-200 text-xs font-bold text-indigo-700 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Transkripsi Otomatis (AI Cerdas)</span>
              </button>

              {/* Export Button */}
              <button
                type="button"
                onClick={handleExportVTT}
                disabled={subtitles.length === 0}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh File .VTT</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. TIMELINE CUE EDITOR & AUDIODESKRIPSI */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel A: Daftar Timeline Subtitle */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Daftar Baris Takarir CC ({subtitles.length} Baris)</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Tiap baris akan muncul di layar video sesuai rentang detik
              </p>
            </div>
          </div>

          {/* Subtitles Timeline List */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {subtitles.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Subtitles className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                <p className="text-xs text-slate-400">Belum ada takarir.</p>
                <button
                  type="button"
                  onClick={handleAutoGenerate}
                  className="mt-2 text-xs font-bold text-indigo-600 underline"
                >
                  Gunakan Transkripsi Otomatis
                </button>
              </div>
            ) : (
              subtitles.map((sub, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border text-xs flex items-center justify-between gap-3 transition ${
                    currentTime >= sub.start && currentTime <= sub.end
                      ? 'border-indigo-400 bg-indigo-50/60 ring-2 ring-indigo-400/20'
                      : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span className="font-mono font-bold text-[11px] px-2 py-0.5 rounded-lg bg-indigo-100 text-indigo-800 flex-shrink-0">
                      {sub.start}s - {sub.end}s
                    </span>
                    <span className="font-semibold text-slate-800 truncate">
                      {sub.text}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteSubtitle(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                    title="Hapus baris takarir"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Tambah Baris Baru Form */}
          <form onSubmit={handleAddSubtitle} className="pt-3 border-t border-slate-100 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Mulai (Detik):
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={newSubStart}
                  onChange={(e) => setNewSubStart(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Selesai (Detik):
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={newSubEnd}
                  onChange={(e) => setNewSubEnd(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSubText}
                onChange={(e) => setNewSubText(e.target.value)}
                placeholder="Ketik teks ucapan instruktur..."
                className="flex-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
              />

              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1 shadow transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>
          </form>
        </div>

        {/* Panel B: Audio Description (Untuk Tunanetra) */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-blue-600" />
                <span>Deskripsi Audio (Audiodeskripsi)</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Narasi visual untuk menjelaskan apa yang terjadi di layar bagi siswa Tunanetra
              </p>
            </div>

            <button
              type="button"
              onClick={() => speak(audioDescription)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 hover:bg-blue-100 transition"
              title="Dengarkan pembacaan teks"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Uji Suara</span>
            </button>
          </div>

          <textarea
            rows="6"
            value={audioDescription}
            onChange={(e) => setAudioDescription(e.target.value)}
            placeholder="Contoh: Instruktur meletakkan wadah lilin kedelai di atas meja kerja. Tangan kiri memegang toples kaca dan tangan kanan menata sumbu katun tepat di tengah..."
            className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 leading-relaxed focus:outline-none focus:border-indigo-500"
          />

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              Aksesibilitas Ganda (Tunanetra & Tunarungu)
            </span>
            <p className="text-[11px] opacity-80 leading-relaxed">
              Dengan melengkapi takarir subtitle dan deskripsi audio di sini, satu video tutorial yang Anda unggah langsung ramah diakses oleh 100% ragam disabilitas secara bersamaan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAccessibility;
