import { initialCourses } from '../data/coursesData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Initial sample students with specific sensory accessibility profiles
const initialStudents = [
  {
    id: 'std-001',
    name: 'Budi Santoso',
    sensoryProfile: 'rungu',
    profileLabel: 'Tunarungu (Takarir CC & Video JBI)',
    school: 'SLB Negeri 1 Pembina',
    progressSummary: 'Menyelesaikan 3 langkah Lilin Aromaterapi',
    lastActive: 'Hari ini',
  },
  {
    id: 'std-002',
    name: 'Siti Rahmawati',
    sensoryProfile: 'wicara',
    profileLabel: 'Tunawicara (Navigasi Sentuh Murni)',
    school: 'SLB Inklusif Mandiri',
    progressSummary: 'Menyelesaikan modul Sabun Herbal & Kalkulator Untung',
    lastActive: 'Kemarin',
  },
  {
    id: 'std-003',
    name: 'Dimas Anggoro',
    sensoryProfile: 'rungu',
    profileLabel: 'Tunarungu (Takarir CC & Video JBI)',
    school: 'Sekolah Vokasi Mandiri',
    progressSummary: 'Sedang mempelajari Tata Boga Kue Kering',
    lastActive: '2 hari lalu',
  },
  {
    id: 'std-004',
    name: 'Aisyah Putri',
    sensoryProfile: 'wicara',
    profileLabel: 'Tunawicara (Navigasi Sentuh Murni)',
    school: 'SLB Harapan Bangsa',
    progressSummary: 'Menyelesaikan Tatakan Gelas Anyaman',
    lastActive: '3 hari lalu',
  },
];

// Initial raw materials master data
const initialMaterials = [
  { id: 'mat-1', name: 'Lilin Kedelai (Soy Wax) 1 kg', unit: 'kg', cost: 45000, category: 'Lilin' },
  { id: 'mat-2', name: 'Minyak Esensial Lavender 10 ml', unit: 'botol', cost: 18000, category: 'Lilin' },
  { id: 'mat-3', name: 'Sumbu Katun Alami (10 pcs)', unit: 'pack', cost: 5000, category: 'Lilin' },
  { id: 'mat-4', name: 'Toples Kaca Kedap Udara 150ml', unit: 'buah', cost: 4000, category: 'Wadah' },
  { id: 'mat-5', name: 'Basis Sabun Gliserin Nabati 1 kg', unit: 'kg', cost: 38000, category: 'Sabun' },
  { id: 'mat-6', name: 'Tepung Terigu Protein Rendah 1 kg', unit: 'kg', cost: 14000, category: 'Tata Boga' },
  { id: 'mat-7', name: 'Tali Rami Alami Roll 50m', unit: 'roll', cost: 20000, category: 'Anyaman' },
];

const LOCAL_STORAGE_KEYS = {
  COURSES: 'sensoria_db_courses',
  STUDENTS: 'sensoria_db_students',
  MATERIALS: 'sensoria_db_materials',
};

const getLocalData = (key, seed) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw);
    if (key === LOCAL_STORAGE_KEYS.COURSES && Array.isArray(parsed) && Array.isArray(seed)) {
      const merged = parsed.map((item) => {
        const seedItem = seed.find((s) => s.id === item.id);
        if (!seedItem) return item;
        return {
          ...seedItem,
          ...item,
          thumbnail: item.thumbnail || seedItem.thumbnail,
          videoDuration: item.videoDuration || seedItem.videoDuration,
          sensoryFeatures: item.sensoryFeatures || seedItem.sensoryFeatures,
          sensoryHighlights: item.sensoryHighlights || seedItem.sensoryHighlights,
        };
      });
      return merged;
    }
    return parsed;
  } catch (err) {
    console.error(`Error loading ${key} from storage:`, err);
    return seed;
  }
};

const saveLocalData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
};

export const dbService = {
  // Check Database status (Supabase -> Vercel Serverless -> Local Storage)
  async checkDatabaseStatus() {
    // 1. Prioritaskan cek Supabase Free Tier jika variabel VITE_SUPABASE_* ada
    if (isSupabaseConfigured() && supabase) {
      try {
        const startTime = Date.now();
        const { count, error } = await supabase
          .from('courses')
          .select('*', { count: 'exact', head: true });

        if (!error) {
          const latency = Date.now() - startTime;
          return {
            configured: true,
            connected: true,
            provider: 'Supabase Cloud (PostgreSQL Free Tier)',
            latencyMs: latency,
            message: 'Terhubung ke database cloud Supabase Free Tier secara langsung dari frontend!',
          };
        }
      } catch (err) {
        // Fall through to next check
      }
    }

    // 2. Cek Vercel Serverless Postgres API
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        if (data.connected) {
          return data;
        }
      }
    } catch (err) {
      // Local dev without serverless api running
    }

    return {
      configured: false,
      connected: false,
      provider: isSupabaseConfigured() ? 'Supabase (Perlu Eksekusi SQL)' : 'Penyimpanan Lokal / Demo',
      message: isSupabaseConfigured()
        ? 'Kredensial Supabase terdeteksi! Jalankan script supabase_schema.sql di Supabase SQL Editor.'
        : 'Mode database lokal aktif. Sambungkan Supabase Free Tier atau Vercel Postgres untuk penyimpanan cloud.',
    };
  },

  // Initialize Vercel Postgres tables (if using Vercel API)
  async initVercelDatabase() {
    try {
      const res = await fetch('/api/init', { method: 'POST' });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ===================== COURSES (MODUL) =====================
  async getCourses() {
    // 1. Supabase Cloud (Free Tier)
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map((c) => ({
            ...c,
            durationText: c.duration_text || c.durationText || '4 Langkah',
            defaultModal: Number(c.default_modal || c.defaultModal || 0),
            defaultPrice: Number(c.default_price || c.defaultPrice || 0),
            steps: typeof c.steps === 'string' ? JSON.parse(c.steps) : c.steps || [],
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch error, fallback:', err);
      }
    }

    // 2. Vercel Serverless Postgres API
    try {
      const res = await fetch('/api/courses');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data.map((c) => ({
            ...c,
            durationText: c.duration_text || c.durationText || '4 Langkah',
            defaultModal: Number(c.default_modal || c.defaultModal || 0),
            defaultPrice: Number(c.default_price || c.defaultPrice || 0),
            steps: typeof c.steps === 'string' ? JSON.parse(c.steps) : c.steps || [],
          }));
        }
      }
    } catch (err) {
      // Offline / standalone local dev fallback
    }

    // 3. Local Storage fallback
    return getLocalData(LOCAL_STORAGE_KEYS.COURSES, initialCourses);
  },

  async getCourseById(id) {
    const courses = await this.getCourses();
    return courses.find((c) => c.id === id) || null;
  },

  async saveCourse(course) {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('courses').upsert({
          id: course.id,
          title: course.title,
          category: course.category || 'Kriya & Kerajinan',
          duration_text: course.durationText || course.duration_text || '4 Langkah',
          default_modal: Number(course.defaultModal || course.default_modal || 0),
          default_price: Number(course.defaultPrice || course.default_price || 0),
          description: course.description || '',
          steps: course.steps || [],
        });
      } catch (err) {
        console.warn('Supabase save course error:', err);
      }
    }

    try {
      await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course),
      });
    } catch (err) {
      // Offline fallback
    }

    const courses = getLocalData(LOCAL_STORAGE_KEYS.COURSES, initialCourses);
    const existingIndex = courses.findIndex((c) => c.id === course.id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...courses];
      updated[existingIndex] = { ...updated[existingIndex], ...course };
    } else {
      updated = [course, ...courses];
    }
    saveLocalData(LOCAL_STORAGE_KEYS.COURSES, updated);
    return { success: true, data: course };
  },

  async deleteCourse(id) {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('courses').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete course error:', err);
      }
    }

    try {
      await fetch(`/api/courses?id=${id}`, { method: 'DELETE' });
    } catch (err) {
      // Offline fallback
    }

    const courses = getLocalData(LOCAL_STORAGE_KEYS.COURSES, initialCourses);
    const updated = courses.filter((c) => c.id !== id);
    saveLocalData(LOCAL_STORAGE_KEYS.COURSES, updated);
    return { success: true };
  },

  // ===================== STUDENTS (DATA SISWA) =====================
  async getStudents() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map((s) => ({
            ...s,
            sensoryProfile: s.sensory_profile || s.sensoryProfile,
            profileLabel: s.profile_label || s.profileLabel,
            progressSummary: s.progress_summary || s.progressSummary,
            lastActive: s.last_active || s.lastActive,
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch students error:', err);
      }
    }

    try {
      const res = await fetch('/api/students');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data.map((s) => ({
            ...s,
            sensoryProfile: s.sensory_profile || s.sensoryProfile,
            profileLabel: s.profile_label || s.profileLabel,
            progressSummary: s.progress_summary || s.progressSummary,
            lastActive: s.last_active || s.lastActive,
          }));
        }
      }
    } catch (err) {
      // Fallback
    }
    return getLocalData(LOCAL_STORAGE_KEYS.STUDENTS, initialStudents);
  },

  async saveStudent(student) {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('students').upsert({
          id: student.id,
          name: student.name,
          sensory_profile: student.sensoryProfile || student.sensory_profile || 'rungu',
          profile_label: student.profileLabel || student.profile_label || '',
          school: student.school || '',
          progress_summary: student.progressSummary || student.progress_summary || '',
          last_active: student.lastActive || student.last_active || 'Baru saja',
        });
      } catch (err) {
        console.warn('Supabase save student error:', err);
      }
    }

    try {
      await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student),
      });
    } catch (err) {
      // Fallback
    }

    const students = getLocalData(LOCAL_STORAGE_KEYS.STUDENTS, initialStudents);
    const existingIndex = students.findIndex((s) => s.id === student.id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...students];
      updated[existingIndex] = { ...updated[existingIndex], ...student };
    } else {
      updated = [student, ...students];
    }
    saveLocalData(LOCAL_STORAGE_KEYS.STUDENTS, updated);
    return { success: true, data: student };
  },

  async deleteStudent(id) {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('students').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete student error:', err);
      }
    }

    try {
      await fetch(`/api/students?id=${id}`, { method: 'DELETE' });
    } catch (err) {
      // Fallback
    }

    const students = getLocalData(LOCAL_STORAGE_KEYS.STUDENTS, initialStudents);
    const updated = students.filter((s) => s.id !== id);
    saveLocalData(LOCAL_STORAGE_KEYS.STUDENTS, updated);
    return { success: true };
  },

  // ===================== MATERIALS (MASTER BIAYA BAHAN) =====================
  async getMaterials() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('materials')
          .select('*')
          .order('name', { ascending: true });

        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map((m) => ({
            ...m,
            cost: Number(m.cost || 0),
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch materials error:', err);
      }
    }

    try {
      const res = await fetch('/api/materials');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data.map((m) => ({
            ...m,
            cost: Number(m.cost || 0),
          }));
        }
      }
    } catch (err) {
      // Fallback
    }
    return getLocalData(LOCAL_STORAGE_KEYS.MATERIALS, initialMaterials);
  },

  async saveMaterial(material) {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('materials').upsert({
          id: material.id,
          name: material.name,
          unit: material.unit || 'kg',
          cost: Number(material.cost || 0),
          category: material.category || 'Umum',
        });
      } catch (err) {
        console.warn('Supabase save material error:', err);
      }
    }

    try {
      await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(material),
      });
    } catch (err) {
      // Fallback
    }

    const materials = getLocalData(LOCAL_STORAGE_KEYS.MATERIALS, initialMaterials);
    const existingIndex = materials.findIndex((m) => m.id === material.id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...materials];
      updated[existingIndex] = { ...updated[existingIndex], ...material };
    } else {
      updated = [material, ...materials];
    }
    saveLocalData(LOCAL_STORAGE_KEYS.MATERIALS, updated);
    return { success: true, data: material };
  },

  async deleteMaterial(id) {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('materials').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete material error:', err);
      }
    }

    try {
      await fetch(`/api/materials?id=${id}`, { method: 'DELETE' });
    } catch (err) {
      // Fallback
    }

    const materials = getLocalData(LOCAL_STORAGE_KEYS.MATERIALS, initialMaterials);
    const updated = materials.filter((m) => m.id !== id);
    saveLocalData(LOCAL_STORAGE_KEYS.MATERIALS, updated);
    return { success: true };
  },

  // ===================== STATS & METRICS =====================
  async getStats() {
    const courses = await this.getCourses();
    const students = await this.getStudents();
    const materials = await this.getMaterials();
    const dbStatus = await this.checkDatabaseStatus();

    let totalSteps = 0;
    let totalSubtitles = 0;
    let coursesWithJBI = 0;

    courses.forEach((c) => {
      if (Array.isArray(c.steps)) {
        totalSteps += c.steps.length;
        c.steps.forEach((s) => {
          if (s.subtitles && s.subtitles.length > 0) {
            totalSubtitles += s.subtitles.length;
          }
        });
      }
      coursesWithJBI += 1;
    });

    return {
      totalCourses: courses.length,
      totalSteps,
      totalSubtitles,
      coursesWithJBI,
      totalStudents: students.length,
      totalMaterials: materials.length,
      isVercelConnected: dbStatus.connected,
      dbProvider: dbStatus.provider || 'Vercel Postgres (Neon)',
      dbMessage: dbStatus.message,
    };
  },
};
