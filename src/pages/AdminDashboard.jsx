import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useA11y } from '../context/A11yContext';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import AdminOverview from '../components/admin/AdminOverview';
import AdminCourses from '../components/admin/AdminCourses';
import AdminAccessibility from '../components/admin/AdminAccessibility';
import AdminMaterials from '../components/admin/AdminMaterials';
import AdminStudents from '../components/admin/AdminStudents';
import {
  Clock,
  Users,
  LayoutGrid,
  Subtitles,
  Tag,
  LogOut,
  Search,
  Bell,
  ChevronRight,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';

const AdminDashboard = () => {
  const { highContrast } = useA11y();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Database states
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalSteps: 0,
    totalSubtitles: 0,
    coursesWithJBI: 0,
    totalStudents: 0,
    totalMaterials: 0,
    isCloudConnected: false,
    dbProvider: 'Supabase',
  });
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // Load all data from dbService
  const loadDatabaseData = async () => {
    setLoading(true);
    try {
      const [fetchedCourses, fetchedMaterials, fetchedStudents, fetchedStats] = await Promise.all([
        dbService.getCourses(),
        dbService.getMaterials(),
        dbService.getStudents(),
        dbService.getStats(),
      ]);

      setCourses(fetchedCourses);
      setMaterials(fetchedMaterials);
      setStudents(fetchedStudents);
      setStats(fetchedStats);
    } catch (err) {
      console.error('Error loading admin database data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Handlers for courses
  const handleSaveCourse = async (course) => {
    await dbService.saveCourse(course);
    await loadDatabaseData();
    showToast(`Modul "${course.title}" berhasil disimpan.`);
  };

  const handleDeleteCourse = async (id, title) => {
    if (window.confirm(`Yakin ingin menghapus modul "${title}"?`)) {
      await dbService.deleteCourse(id);
      await loadDatabaseData();
      showToast(`Modul "${title}" telah dihapus.`);
    }
  };

  // Handlers for materials
  const handleSaveMaterial = async (material) => {
    await dbService.saveMaterial(material);
    await loadDatabaseData();
    showToast(`Bahan baku "${material.name}" berhasil disimpan.`);
  };

  const handleDeleteMaterial = async (id, name) => {
    if (window.confirm(`Hapus bahan "${name}" dari master?`)) {
      await dbService.deleteMaterial(id);
      await loadDatabaseData();
      showToast(`Bahan "${name}" telah dihapus.`);
    }
  };

  // Handlers for students
  const handleSaveStudent = async (student) => {
    await dbService.saveStudent(student);
    await loadDatabaseData();
    showToast(`Siswa "${student.name}" berhasil disimpan.`);
  };

  const handleDeleteStudent = async (id, name) => {
    if (window.confirm(`Hapus data siswa "${name}"?`)) {
      await dbService.deleteStudent(id);
      await loadDatabaseData();
      showToast(`Data siswa "${name}" telah dihapus.`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Sidebar navigation items matching the screenshot icons
  const navItems = [
    { id: 'overview', label: 'Ringkasan', icon: Clock },
    { id: 'students', label: 'Daftar Siswa', icon: Users, badge: students.length },
    { id: 'courses', label: 'Modul Vokasi', icon: LayoutGrid, badge: courses.length },
    { id: 'accessibility', label: 'Takarir CC', icon: Subtitles },
    { id: 'materials', label: 'Master Bahan', icon: Tag, badge: materials.length },
  ];

  // Formatted date string for top bar pill (e.g. "Hari ini, 21 Okt")
  const todayDateString = 'Hari ini, ' + new Date().toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  return (
    <div
      className={`min-h-screen flex transition-colors ${
        highContrast ? 'bg-black text-yellow-300' : 'bg-[#f4f7fb] text-slate-800'
      }`}
    >
      {/* =================================================================== */}
      {/* 1. LEFT SIDEBAR DOCK (MATCHING THE SCREENSHOT) */}
      {/* =================================================================== */}
      <aside
        className={`hidden md:flex flex-col items-center justify-between py-6 px-3 bg-white border-r border-slate-200/80 sticky top-0 h-screen z-30 transition-all duration-300 ${
          sidebarExpanded ? 'w-60' : 'w-20'
        }`}
      >
        {/* Top: Brand Logo Circle with collapse toggle */}
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="flex items-center justify-between w-full px-1">
            {/* Wave / Logo mark inside circle */}
            <div
              onClick={() => setActiveTab('overview')}
              className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#5b32f5] to-indigo-500 text-white flex items-center justify-center font-black text-lg shadow-md shadow-indigo-500/20 cursor-pointer"
              title="SENSORIA Admin"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 stroke-white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M4 12c2.5-3 5.5-3 8 0s5.5 3 8 0" />
                <path d="M4 16c2.5-3 5.5-3 8 0s5.5 3 8 0" />
                <path d="M4 8c2.5-3 5.5-3 8 0s5.5 3 8 0" />
              </svg>
            </div>

            {/* Expand / Collapse button */}
            <button
              type="button"
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              title={sidebarExpanded ? 'Kecilkan sidebar' : 'Perluas sidebar'}
            >
              <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${sidebarExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Navigation Icons Dock */}
          <nav aria-label="Menu Admin" className="flex flex-col items-center gap-3 w-full">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  title={item.label}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all group relative ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {/* Circular icon container */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                      isActive ? 'text-white' : 'text-slate-500'
                    }`}
                  >
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>

                  {/* Label (visible when expanded) */}
                  {sidebarExpanded && (
                    <span className="text-xs font-bold truncate flex-1 text-left">
                      {item.label}
                    </span>
                  )}

                  {/* Badge count */}
                  {typeof item.badge === 'number' && sidebarExpanded && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Logout / Exit button */}
        <div className="w-full pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleLogout}
            title="Keluar"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
              <LogOut className="w-5 h-5" />
            </div>
            {sidebarExpanded && <span className="text-xs font-bold text-left">Keluar</span>}
          </button>
        </div>
      </aside>

      {/* =================================================================== */}
      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-20 w-full">
          {/* Left: Mobile hamburger + Search + Date Badge */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-md min-w-0">
            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 shrink-0"
              aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Search Input */}
            <div className="relative flex-1 min-w-0">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari data..."
                className="w-full pl-8 pr-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition"
              />
            </div>

            {/* Date Badge */}
            <div className="hidden lg:inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-medium text-xs flex-shrink-0">
              {todayDateString}
            </div>
          </div>

          {/* Right: Link to Public Site + Notification Bell + Admin Avatar */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* View Student Site Link */}
            <Link
              to="/courses"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Buka tampilan web siswa / kelas"
            >
              <span>Web Siswa</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            {/* Notification Bell with Badge */}
            <div className="relative">
              <button
                type="button"
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition"
                title="Pemberitahuan"
              >
                <Bell className="w-4 h-4" />
              </button>
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
            </div>

            {/* User Avatar */}
            <div className="flex items-center gap-2 pl-1.5 sm:pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                A
              </div>
              <div className="hidden lg:block text-left">
                <span className="text-xs font-semibold text-slate-900 block leading-tight">
                  {currentUser?.name || 'Admin SENSORIA'}
                </span>
                <span className="text-[10px] text-slate-500 block">Instruktur Vokasi</span>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-1.5 z-20 shadow-md animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl font-bold text-xs transition ${
                    isActive ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {typeof item.badge === 'number' && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-1">
              <Link
                to="/courses"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-between p-3 rounded-xl font-semibold text-xs text-slate-700 hover:bg-slate-100"
              >
                <div className="flex items-center gap-2.5">
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                  <span>Lihat Web Siswa</span>
                </div>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 p-3 rounded-xl font-semibold text-xs text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Content Body */}
        <main className="p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {/* Toast Alert */}
          {toastMessage && (
            <div
              role="status"
              className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm animate-fade-in"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Sub-page Panels */}
          {loading ? (
            <div className="py-24 text-center">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-bold text-slate-400">Menyinkronkan data dari cloud...</p>
            </div>
          ) : (
            <div>
              {/* 1. OVERVIEW (SCREEN 1) */}
              {activeTab === 'overview' && (
                <AdminOverview
                  stats={stats}
                  courses={courses}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {/* 2. DAFTAR SISWA (SCREEN 2 - ORDER LIST STYLE) */}
              {activeTab === 'students' && (
                <AdminStudents
                  students={students}
                  onSaveStudent={handleSaveStudent}
                  onDeleteStudent={handleDeleteStudent}
                />
              )}

              {/* 3. KELOLA MODUL & VIDEO */}
              {activeTab === 'courses' && (
                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
                  <AdminCourses
                    courses={courses}
                    onSaveCourse={handleSaveCourse}
                    onDeleteCourse={handleDeleteCourse}
                  />
                </div>
              )}

              {/* 4. EDITOR TAKARIR CC & AUDIODESKRIPSI */}
              {activeTab === 'accessibility' && (
                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
                  <AdminAccessibility
                    courses={courses}
                    onSaveCourse={handleSaveCourse}
                  />
                </div>
              )}

              {/* 5. MASTER BAHAN BAKU & BIAYA */}
              {activeTab === 'materials' && (
                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
                  <AdminMaterials
                    materials={materials}
                    onSaveMaterial={handleSaveMaterial}
                    onDeleteMaterial={handleDeleteMaterial}
                  />
                </div>
              )}

            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
