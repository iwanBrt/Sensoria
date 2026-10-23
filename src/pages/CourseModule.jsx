import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useA11y } from '../context/A11yContext';
import { dbService } from '../services/dbService';
import { initialCourses } from '../data/coursesData';
import VideoPlayer from '../components/learning/VideoPlayer';
import StepNavigation from '../components/learning/StepNavigation';
import CostCalculator from '../components/accounting/CostCalculator';
import { BookOpen, Calculator, CheckCircle, ChevronLeft } from 'lucide-react';

const CourseModule = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { highContrast, announce } = useA11y();

  const courseId = searchParams.get('id') || 'lilin-aromaterapi';
  const [currentCourse, setCurrentCourse] = useState(
    initialCourses.find((c) => c.id === courseId) || initialCourses[0]
  );
  const [loading, setLoading] = useState(true);

  const activeTab = searchParams.get('tab') === 'accounting' ? 'accounting' : 'learning';
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      const course = await dbService.getCourseById(courseId);
      if (course) {
        setCurrentCourse(course);
      }
      setLoading(false);
    };
    fetchCourse();
  }, [courseId]);

  const setTab = (tabName) => {
    setSearchParams({ id: currentCourse.id, tab: tabName });
    if (tabName === 'accounting') {
      announce(`Beralih ke tab Kalkulator Harga Jual & Analisis AI untuk ${currentCourse.title}`);
    } else {
      announce(`Beralih ke tab Video Materi untuk ${currentCourse.title}`);
    }
  };

  const currentStepData = currentCourse.steps?.[currentStep] || currentCourse.steps?.[0] || {};

  return (
    <div className="w-full py-4 sm:py-8 md:py-10">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb / Back */}
        <div className="mb-3 sm:mb-4">
          <Link
            to="/courses"
            className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold transition ${
              highContrast ? 'text-yellow-300 hover:underline' : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            <span className="sm:hidden">Semua Kelas</span>
            <span className="hidden sm:inline">Kembali ke Katalog Semua Kelas</span>
          </Link>
        </div>

        {/* Course Header */}
        <div className="mb-5 sm:mb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                highContrast
                  ? 'bg-yellow-400 text-black'
                  : 'bg-blue-100 text-blue-900'
              }`}
            >
              {currentCourse.category}
            </span>
          </div>

          <h1
            className={`text-xl sm:text-3xl md:text-4xl font-black ${
              highContrast ? 'text-yellow-400' : 'text-slate-900'
            }`}
          >
            {currentCourse.title}
          </h1>
          <p className={`text-xs sm:text-base mt-1 ${highContrast ? 'text-yellow-200' : 'text-slate-600'}`}>
            {currentCourse.description}
          </p>
        </div>

        {/* TAB NAVIGATION: 1. Video Praktik | 2. Kalkulator HPP */}
        <div
          role="tablist"
          aria-label="Pilihan Bagian Belajar"
          className="grid grid-cols-2 gap-2 border-b-2 border-slate-200 dark:border-yellow-400 mb-6 pb-1"
        >
          <button
            role="tab"
            id="tab-learning"
            aria-controls="panel-learning"
            aria-selected={activeTab === 'learning'}
            type="button"
            onClick={() => setTab('learning')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 py-2.5 sm:px-6 sm:py-3 font-bold text-xs sm:text-base border-b-4 transition rounded-t-xl ${
              activeTab === 'learning'
                ? highContrast
                  ? 'border-yellow-400 text-yellow-300 bg-yellow-950/40'
                  : 'border-blue-600 text-blue-700 bg-blue-50/70 shadow-xs'
                : highContrast
                ? 'border-transparent text-slate-400 hover:text-yellow-300'
                : 'border-transparent text-slate-600 hover:text-slate-900 bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" aria-hidden="true" />
            <span className="sm:hidden">1. Video Praktik</span>
            <span className="hidden sm:inline">1. Video & Panduan Praktik</span>
          </button>

          <button
            role="tab"
            id="tab-accounting"
            aria-controls="panel-accounting"
            aria-selected={activeTab === 'accounting'}
            type="button"
            onClick={() => setTab('accounting')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 py-2.5 sm:px-6 sm:py-3 font-bold text-xs sm:text-base border-b-4 transition rounded-t-xl ${
              activeTab === 'accounting'
                ? highContrast
                  ? 'border-yellow-400 text-yellow-300 bg-yellow-950/40'
                  : 'border-emerald-600 text-emerald-700 bg-emerald-50/70 shadow-xs'
                : highContrast
                ? 'border-transparent text-slate-400 hover:text-yellow-300'
                : 'border-transparent text-slate-600 hover:text-slate-900 bg-slate-50'
            }`}
          >
            <Calculator className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" aria-hidden="true" />
            <span className="sm:hidden">2. Kalkulator HPP</span>
            <span className="hidden sm:inline">2. Kalkulator Harga Jual & AI</span>
          </button>
        </div>

        {/* TAB 1: VIDEO & STEP GUIDE */}
        {activeTab === 'learning' && (
          <div
            id="panel-learning"
            role="tabpanel"
            aria-labelledby="tab-learning"
            className="space-y-6"
          >
            {/* Accessible Video Player */}
            <div className="max-w-4xl mx-auto">
              <VideoPlayer currentStepData={currentStepData} courseThumbnail={currentCourse.thumbnail} />
            </div>

            {/* Current Step Summary */}
            <div
              className={`p-6 sm:p-8 rounded-2xl border-2 transition max-w-4xl mx-auto ${
                highContrast
                  ? 'bg-black border-yellow-400 text-yellow-300'
                  : 'bg-white border-slate-200 text-slate-900 shadow-sm'
              }`}
            >
              <div className="mb-3">
                <h2 className="text-xl sm:text-2xl font-black">{currentStepData.title}</h2>
              </div>

              <p className={`text-base sm:text-lg leading-relaxed mb-5 ${highContrast ? 'text-yellow-200' : 'text-slate-700'}`}>
                {currentStepData.summary}
              </p>

              {/* Materials */}
              {currentStepData.materials && currentStepData.materials.length > 0 && (
                <div
                  className={`p-4 rounded-xl border ${
                    highContrast ? 'border-yellow-400/60 bg-yellow-950/20' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <h3 className="font-bold text-xs uppercase tracking-wider mb-2 opacity-80">
                    Alat dan Bahan untuk Langkah Ini:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-base">
                    {currentStepData.materials.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className={`w-4 h-4 flex-shrink-0 ${highContrast ? 'text-yellow-400' : 'text-emerald-600'}`} />
                        <span className="font-semibold">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Step Navigation */}
            {currentCourse.steps && currentCourse.steps.length > 0 && (
              <div className="max-w-4xl mx-auto">
                <StepNavigation
                  steps={currentCourse.steps}
                  currentStep={currentStep}
                  onSelectStep={(idx) => setCurrentStep(idx)}
                  onGoToAccounting={() => setTab('accounting')}
                />
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CALCULATOR */}
        {activeTab === 'accounting' && (
          <div
            id="panel-accounting"
            role="tabpanel"
            aria-labelledby="tab-accounting"
            className="max-w-4xl mx-auto"
          >
            <CostCalculator
              courseTitle={currentCourse.title}
              defaultModal={currentCourse.defaultModal}
              defaultPrice={currentCourse.defaultPrice}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseModule;
