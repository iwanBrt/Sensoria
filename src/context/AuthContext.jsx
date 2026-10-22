import React, { createContext, useContext, useState, useEffect } from 'react';
import { useA11y } from './A11yContext';
import { dbService } from '../services/dbService';

const AuthContext = createContext();

const SENSORY_LABELS = {
  netra: 'Tunanetra (Mode Suara & Pembaca Layar)',
  kurang_awas: 'Kurang Awas (Kontras Tinggi & Font Besar)',
  rungu: 'Tunarungu (Takarir CC & Video JBI)',
  wicara: 'Tunawicara (Navigasi Sentuh Murni)',
};

export const AuthProvider = ({ children }) => {
  const { toggleHighContrast, increaseFontSize, speak, announce } = useA11y();

  // Load current session from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sensoria_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      return null;
    }
  });

  // Save session when user changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sensoria_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sensoria_auth_user');
    }
  }, [currentUser]);

  // Apply sensory adaptations to document and assistive tools
  const applySensoryAdaptation = (name, sensoryProfile) => {
    if (sensoryProfile === 'netra') {
      announce(`Halo ${name}! Selamat datang di ruang belajarmu. Panduan suara telah aktif.`);
      speak(
        `Halo ${name}! Selamat datang di SENSORIA. Gunakan tombol Tab di keyboard untuk berpindah antarmenu, dan tombol Enter untuk memilih pelajaran.`
      );
    } else if (sensoryProfile === 'kurang_awas') {
      const isHighContrast = document.documentElement.classList.contains('high-contrast');
      if (!isHighContrast) toggleHighContrast();
      increaseFontSize();
      announce(`Halo ${name}! Mode kontras tinggi dan huruf ekstra besar telah diaktifkan untuk kenyamanan matamu.`);
    } else if (sensoryProfile === 'rungu') {
      announce(`Halo ${name}! Mode visual aktif. Seluruh video telah dilengkapi teks takarir CC dan bahasa isyarat.`);
    } else if (sensoryProfile === 'wicara') {
      announce(`Halo ${name}! Mode sentuh santai aktif. Kamu dapat belajar mandiri tanpa perlu berbicara.`);
    }
  };

  // 1. REGISTER NEW STUDENT
  const registerStudent = async ({ name, contact, password, sensoryProfile, school, avatar }) => {
    const studentId = `std-${Date.now()}`;
    const cleanName = name.trim() || 'Teman Sensoria';
    const profileLabel = SENSORY_LABELS[sensoryProfile] || sensoryProfile;

    const newStudentData = {
      id: studentId,
      name: cleanName,
      contact: contact.trim(),
      password: password.trim(),
      sensoryProfile,
      profileLabel,
      school: school?.trim() || 'SLB Inklusif Mandiri',
      avatar: avatar || 'avatar-1',
      progressSummary: `Email/No HP: ${contact.trim()} • Terdaftar baru`,
      lastActive: 'Baru saja',
      registeredAt: new Date().toISOString(),
    };

    // A. Save to Supabase (students table)
    try {
      await dbService.saveStudent(newStudentData);
    } catch (err) {
      console.warn('Could not save to Supabase, saved locally:', err);
    }

    // B. Save to local registered users list for easy re-login without OTP
    try {
      const existing = JSON.parse(localStorage.getItem('sensoria_registered_users') || '[]');
      const filtered = existing.filter((u) => u.contact !== newStudentData.contact);
      filtered.push(newStudentData);
      localStorage.setItem('sensoria_registered_users', JSON.stringify(filtered));
    } catch (e) {
      console.error(e);
    }

    // C. Set current active session
    const studentUser = {
      id: studentId,
      name: cleanName,
      contact: contact.trim(),
      role: 'student',
      sensoryProfile,
      profileLabel,
      school: newStudentData.school,
      avatar: newStudentData.avatar,
      loginTime: new Date().toISOString(),
    };

    setCurrentUser(studentUser);
    applySensoryAdaptation(cleanName, sensoryProfile);
    return studentUser;
  };

  // 2. LOGIN STUDENT WITH CREDENTIALS (Email/No HP + Password)
  const loginStudentWithCredentials = async ({ contact, password, sensoryProfile }) => {
    let matchedUser = null;

    // Check local registered users list
    try {
      const registered = JSON.parse(localStorage.getItem('sensoria_registered_users') || '[]');
      matchedUser = registered.find(
        (u) =>
          u.contact.toLowerCase() === contact.trim().toLowerCase() &&
          (!password || u.password === password.trim())
      );
    } catch (e) {}

    // Fallback: If not found in local, create or login gracefully
    const chosenProfile = sensoryProfile || matchedUser?.sensoryProfile || 'netra';
    const cleanName = matchedUser?.name || contact.split('@')[0] || 'Teman Sensoria';

    const studentUser = {
      id: matchedUser?.id || `std-${Date.now()}`,
      name: cleanName,
      contact: contact.trim(),
      role: 'student',
      sensoryProfile: chosenProfile,
      profileLabel: SENSORY_LABELS[chosenProfile] || chosenProfile,
      school: matchedUser?.school || 'SLB Mandiri',
      avatar: matchedUser?.avatar || 'avatar-1',
      loginTime: new Date().toISOString(),
    };

    setCurrentUser(studentUser);
    applySensoryAdaptation(cleanName, chosenProfile);
    return studentUser;
  };

  // 3. QUICK LOGIN (Direct choice from landing page)
  const loginAsStudent = (name, sensoryProfile) => {
    const studentUser = {
      id: `std-${Date.now()}`,
      name: name.trim() || 'Teman Sensoria',
      role: 'student',
      sensoryProfile,
      profileLabel: SENSORY_LABELS[sensoryProfile] || sensoryProfile,
      loginTime: new Date().toISOString(),
    };

    setCurrentUser(studentUser);
    applySensoryAdaptation(studentUser.name, sensoryProfile);
    return studentUser;
  };

  // 4. LOGIN AS ADMIN
  const loginAsAdmin = (username = 'Admin SENSORIA') => {
    const adminUser = {
      name: username,
      role: 'admin',
      loginTime: new Date().toISOString(),
    };
    setCurrentUser(adminUser);
    announce('Masuk sebagai Pengajar / Admin SENSORIA.');
    return adminUser;
  };

  // 5. LOGOUT
  const logout = () => {
    setCurrentUser(null);
    announce('Anda telah keluar. Kembali ke halaman utama.');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoggedIn: !!currentUser,
        isAdmin: currentUser?.role === 'admin',
        isStudent: currentUser?.role === 'student',
        registerStudent,
        loginStudentWithCredentials,
        loginAsStudent,
        loginAsAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
