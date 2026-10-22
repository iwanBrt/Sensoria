// Helper untuk parsing dan mengekspor subtitle format SRT dan VTT

// Konversi detik ke format timecode VTT (00:00:05.000)
export const formatTimeVTT = (seconds) => {
  const pad = (num, size = 2) => String(Math.floor(num)).padStart(size, '0');
  const hrs = pad(seconds / 3600);
  const mins = pad((seconds % 3600) / 60);
  const secs = pad(seconds % 60);
  const ms = pad(Math.floor((seconds % 1) * 1000), 3);
  return `${hrs}:${mins}:${secs}.${ms}`;
};

// Konversi timecode SRT/VTT (00:01:23,450 atau 00:01:23.450) ke detik
export const parseTimeToSeconds = (timeStr) => {
  if (!timeStr) return 0;
  const normalized = timeStr.replace(',', '.').trim();
  const parts = normalized.split(':');
  if (parts.length === 3) {
    const hours = parseFloat(parts[0]) || 0;
    const minutes = parseFloat(parts[1]) || 0;
    const seconds = parseFloat(parts[2]) || 0;
    return Math.round((hours * 3600 + minutes * 60 + seconds) * 10) / 10;
  }
  if (parts.length === 2) {
    const minutes = parseFloat(parts[0]) || 0;
    const seconds = parseFloat(parts[1]) || 0;
    return Math.round((minutes * 60 + seconds) * 10) / 10;
  }
  return parseFloat(timeStr) || 0;
};

// Parser untuk file .SRT atau .VTT
export const parseSubtitleFile = (content) => {
  if (!content || typeof content !== 'string') return [];

  const lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const results = [];
  let currentCue = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Abaikan header WEBVTT
    if (line.startsWith('WEBVTT') || line.startsWith('NOTE')) continue;

    // Deteksi baris timestamp: "00:00:01.000 --> 00:00:05.000"
    if (line.includes('-->')) {
      const parts = line.split('-->');
      if (parts.length === 2) {
        currentCue = {
          start: parseTimeToSeconds(parts[0]),
          end: parseTimeToSeconds(parts[1]),
          text: '',
        };
      }
      continue;
    }

    // Jika sedang dalam cue dan ada teks
    if (currentCue && line.length > 0 && !/^\d+$/.test(line)) {
      currentCue.text = currentCue.text ? `${currentCue.text} ${line}` : line;
    } else if (line.length === 0 && currentCue && currentCue.text) {
      results.push(currentCue);
      currentCue = null;
    }
  }

  if (currentCue && currentCue.text) {
    results.push(currentCue);
  }

  return results;
};

// Ekspor array subtitle ke format .VTT
export const exportToVTT = (subtitles = [], title = 'SENSORIA Subtitle') => {
  let vtt = `WEBVTT - ${title}\n\n`;
  subtitles.forEach((sub, idx) => {
    vtt += `${idx + 1}\n`;
    vtt += `${formatTimeVTT(sub.start)} --> ${formatTimeVTT(sub.end)}\n`;
    vtt += `${sub.text}\n\n`;
  });
  return vtt;
};

// Smart Auto-Generator Subtitle (AI Assistant)
export const autoGenerateSubtitles = (summaryText, duration = 40) => {
  const baseText = summaryText && summaryText.length > 10
    ? summaryText
    : 'Halo semuanya, selamat datang di kelas vokasi SENSORIA. Hari ini kita akan mempraktikkan keterampilan mandiri langkah demi langkah. Pastikan peralatan telah siap di atas meja kerja.';

  // Potong teks menjadi 3-4 kalimat/frasa
  const sentences = baseText
    .split(/[\.\,\;\!]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8);

  const cuesCount = Math.max(sentences.length, 3);
  const timeSlice = Math.floor(duration / cuesCount);
  const generated = [];

  for (let i = 0; i < cuesCount; i++) {
    const start = i * timeSlice;
    const end = i === cuesCount - 1 ? duration : (i + 1) * timeSlice;
    const text = sentences[i] || (i === 0
      ? 'Selamat datang di materi vokasi SENSORIA.'
      : i === 1
      ? 'Perhatikan posisi tangan dan takaran bahan dengan seksama.'
      : 'Selesaikan langkah ini sebelum melanjutkan ke tahapan berikutnya.');

    generated.push({
      start,
      end,
      text: text.charAt(0).toUpperCase() + text.slice(1) + '.',
    });
  }

  return generated;
};
