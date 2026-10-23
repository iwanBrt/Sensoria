import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { A11yProvider } from './context/A11yContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import StudentDashboard from './pages/StudentDashboard';
import CourseCatalog from './pages/CourseCatalog';
import CourseModule from './pages/CourseModule';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <A11yProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 transition-colors w-full max-w-full overflow-x-hidden">
            {/* Accessible Header with role-based navigation */}
            <Header />

            {/* Main Landmark for Screen Readers & Skip Links */}
            <main id="main-content" tabIndex="-1" className="flex-1 focus:outline-none w-full max-w-full overflow-x-hidden">
              <Routes>
                {/* 1. Public Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* 2. Registrasi & Login Siswa / Admin */}
                <Route path="/register" element={<AuthPage />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/auth" element={<AuthPage />} />

                {/* 3. Ruang Belajar Siswa (Muncul setelah siswa memilih jenis tuna & login) */}
                <Route path="/dashboard" element={<StudentDashboard />} />

                {/* 4. Katalog Semua Modul Vokasi */}
                <Route path="/courses" element={<CourseCatalog />} />

                {/* 5. Pemutar Video & Kalkulator Usaha */}
                <Route path="/course" element={<CourseModule />} />

                {/* 6. Dashboard Admin & Pengelolaan Konten */}
                <Route path="/admin" element={<AdminDashboard />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Accessible Footer */}
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </A11yProvider>
  );
}

export default App;
