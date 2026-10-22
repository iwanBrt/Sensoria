import React, { useState, useEffect, useRef } from 'react';
import { useA11y } from '../../context/A11yContext';
import { useAuth } from '../../context/AuthContext';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Subtitles,
  UserCheck,
  Headphones,
  Maximize2
} from 'lucide-react';

const VideoPlayer = ({ currentStepData, courseThumbnail }) => {
  const { highContrast, speak, announce } = useA11y();
  const { currentUser } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showCaptions, setShowCaptions] = useState(true);
  const [showJBI, setShowJBI] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const timerRef = useRef(null);

  const duration = currentStepData?.duration || 45; // seconds
  const subtitlesList = currentStepData?.subtitles || [
    { start: 0, end: 10, text: "Selamat datang di modul pembuatan lilin aromaterapi ramah lingkungan." },
    { start: 10, end: 25, text: "Pastikan lilin kedelai dipanaskan pada suhu sedang agar tidak mendidih secara berlebih." },
    { start: 25, end: 45, text: "Tambahkan minyak esensial saat lilin mulai mendingin untuk aroma yang awet dan menyegarkan." }
  ];

  // Current caption lookup
  const activeCaption = subtitlesList.find(
    (item) => currentTime >= item.start && currentTime <= item.end
  )?.text || "";

  // Video play timer simulation
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            announce("Video selesai diputar.");
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isPlaying, playbackSpeed, duration, announce]);

  const togglePlay = () => {
    setIsPlaying((prev) => {
      const next = !prev;
      if (next) {
        announce("Video mulai diputar");
        if (activeCaption) {
          speak(activeCaption);
        }
      } else {
        announce("Video dijeda");
      }
      return next;
    });
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(true);
    announce("Video diulang dari awal");
  };

  const toggleCaptions = () => {
    setShowCaptions((prev) => {
      const next = !prev;
      announce(next ? "Takarir teks diaktifkan" : "Takarir teks dinonaktifkan");
      return next;
    });
  };

  const toggleJBI = () => {
    setShowJBI((prev) => {
      const next = !prev;
      announce(next ? "Juru Bahasa Isyarat ditampilkan" : "Juru Bahasa Isyarat disembunyikan");
      return next;
    });
  };

  const handleAudioDescription = () => {
    const desc = currentStepData?.audioDescription || "Deskripsi Audio: Terlihat instruktur sedang menuangkan lilin kedelai cair ke dalam wadah kaca dengan sumbu katun yang sudah terpasang rapi.";
    speak(desc);
  };

  return (
    <div
      className={`rounded-2xl overflow-hidden border shadow-lg transition-colors ${
        highContrast
          ? 'bg-black border-yellow-400 text-yellow-300'
          : 'bg-slate-900 border-slate-800 text-white'
      }`}
      aria-label="Pemutar Video Materi dengan Takarir dan Juru Bahasa Isyarat"
    >
      {/* Video Screen / Canvas Viewport */}
      <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
        {/* Background Image / Workshop Scene */}
        {courseThumbnail && (
          <img
            src={courseThumbnail}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              isPlaying ? 'opacity-25 scale-105 filter blur-[1px]' : 'opacity-40 scale-100'
            }`}
          />
        )}

        {/* Simulated main vocational lecture scene */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none bg-gradient-to-b from-black/60 via-slate-950/70 to-black/90">
          <div className="w-20 h-20 rounded-2xl bg-blue-600/40 border border-blue-400/40 flex items-center justify-center mb-3 backdrop-blur-sm shadow-xl">
            <Play className="w-10 h-10 text-blue-200 ml-1 fill-current" aria-hidden="true" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black max-w-lg text-white drop-shadow">
            {currentStepData?.title || "Praktik Keterampilan Mandiri"}
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-md">
            {isPlaying ? "Sedang memutar video tutorial..." : "Tekan tombol Putar di bawah untuk memulai pembelajaran"}
          </p>

          {/* Playing progress visual indicator & Student Adaptation Note */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <div className="px-4 py-1.5 rounded-full bg-black/80 border border-white/20 text-xs font-mono text-white shadow">
              {Math.floor(currentTime / 60)}:{('0' + (currentTime % 60)).slice(-2)} / {Math.floor(duration / 60)}:{('0' + (duration % 60)).slice(-2)}
            </div>
            {currentUser?.sensoryProfile && (
              <div className="px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-[11px] font-bold">
                ✓ Adaptif: {currentUser.sensoryProfile.toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* PICTURE-IN-PICTURE (PIP) FOR JURU BAHASA ISYARAT (JBI) - FOR TUNARUNGU */}
        {showJBI && (
          <aside
            aria-label="Jendela Juru Bahasa Isyarat (JBI)"
            className={`absolute bottom-16 right-4 sm:bottom-20 sm:right-6 w-32 h-44 sm:w-44 sm:h-56 rounded-xl border-2 shadow-2xl overflow-hidden z-20 flex flex-col ${
              highContrast
                ? 'bg-black border-yellow-400'
                : 'bg-slate-950/95 border-emerald-500 ring-2 ring-emerald-500/50'
            }`}
          >
            {/* JBI Header badge */}
            <div className={`px-2 py-1 text-[11px] font-bold uppercase tracking-wider flex items-center justify-between ${
              highContrast ? 'bg-yellow-400 text-black' : 'bg-emerald-600 text-white'
            }`}>
              <span className="flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
                JBI (Isyarat)
              </span>
              <span className="animate-pulse text-[10px]">● AKTIF</span>
            </div>

            {/* JBI Visual Avatar / Signer Demonstration */}
            <div className="flex-1 flex flex-col items-center justify-center p-2 bg-gradient-to-b from-slate-900 to-slate-950 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center mb-2">
                <UserCheck className="w-6 h-6 text-emerald-300" aria-hidden="true" />
              </div>
              <span className="text-[11px] font-bold text-emerald-300">
                Penerjemah BISINDO
              </span>
              <p className="text-[9px] text-slate-400 mt-1 line-clamp-2">
                Bahasa isyarat visual untuk Tunarungu
              </p>
            </div>
          </aside>
        )}

        {/* CLOSED CAPTIONS (CC) - LARGE HIGH CONTRAST SUBTITLES FOR TUNARUNGU */}
        {showCaptions && activeCaption && (
          <div
            role="region"
            aria-live="polite"
            className="absolute bottom-4 inset-x-4 sm:inset-x-12 z-20 flex justify-center text-center pointer-events-none"
          >
            <div
              className={`px-5 py-2.5 rounded-xl text-base sm:text-lg font-extrabold max-w-2xl shadow-2xl leading-snug border ${
                highContrast
                  ? 'bg-black text-yellow-300 border-yellow-400'
                  : 'bg-black/90 text-yellow-300 border-amber-400/60'
              }`}
            >
              {activeCaption}
            </div>
          </div>
        )}
      </div>

      {/* VIDEO CONTROLS TOOLBAR - ACCESSIBLE FOR KEYBOARD & SCREEN READERS */}
      <div
        className={`p-4 border-t flex flex-wrap items-center justify-between gap-3 ${
          highContrast ? 'bg-black border-yellow-400' : 'bg-slate-900/95 border-slate-800'
        }`}
      >
        {/* Left: Play/Pause/Restart */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlay}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm sm:text-base transition transform active:scale-95 shadow-md ${
              isPlaying
                ? highContrast
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : highContrast
                ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
            aria-label={isPlaying ? "Jeda Video (Pause)" : "Putar Video (Play)"}
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5" aria-hidden="true" />
                <span>JEDA</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" aria-hidden="true" />
                <span>PUTAR</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleRestart}
            className={`p-2.5 rounded-xl border transition ${
              highContrast
                ? 'border-yellow-400 text-yellow-300 hover:bg-yellow-950'
                : 'border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
            aria-label="Ulang Video dari Awal"
            title="Ulangi Video"
          >
            <RotateCcw className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Audio Description Button for Netra */}
          <button
            type="button"
            onClick={handleAudioDescription}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition ${
              highContrast
                ? 'border-yellow-400 text-yellow-300 hover:bg-yellow-950'
                : 'border-blue-500/50 bg-blue-950/40 text-blue-300 hover:bg-blue-900/60'
            }`}
            aria-label="Dengarkan Deskripsi Audio Visual untuk Tunanetra"
            title="Dengarkan narasi deskripsi adegan visual"
          >
            <Headphones className="w-4 h-4" aria-hidden="true" />
            <span>Deskripsi Audio</span>
          </button>
        </div>

        {/* Right: CC Toggle & JBI Toggle */}
        <div className="flex items-center gap-2">
          {/* CC Button */}
          <button
            type="button"
            onClick={toggleCaptions}
            aria-pressed={showCaptions}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition ${
              showCaptions
                ? highContrast
                  ? 'bg-yellow-400 text-black border-yellow-300'
                  : 'bg-emerald-600 text-white border-emerald-500'
                : highContrast
                ? 'border-yellow-400 text-yellow-400/50'
                : 'border-slate-700 text-slate-400'
            }`}
            aria-label="Toggle Takarir Teks CC (Closed Captions)"
          >
            <Subtitles className="w-4 h-4" aria-hidden="true" />
            <span>CC: {showCaptions ? "AKTIF" : "MATI"}</span>
          </button>

          {/* JBI Button */}
          <button
            type="button"
            onClick={toggleJBI}
            aria-pressed={showJBI}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition ${
              showJBI
                ? highContrast
                  ? 'bg-yellow-400 text-black border-yellow-300'
                  : 'bg-emerald-600 text-white border-emerald-500'
                : highContrast
                ? 'border-yellow-400 text-yellow-400/50'
                : 'border-slate-700 text-slate-400'
            }`}
            aria-label="Toggle Juru Bahasa Isyarat JBI (Picture-in-Picture)"
          >
            <UserCheck className="w-4 h-4" aria-hidden="true" />
            <span>JBI: {showJBI ? "TAMPIL" : "SEMBUNYI"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
