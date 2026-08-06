import React, { useState, useEffect } from 'react';
import { NavigationPage, Course, DownloadItem, GalleryItem, NoticeItem, StudentProfile } from './types';
import { COURSES, DOWNLOADS_LIST } from './data/mockData';
import { supabase, getStudentProfileFromSupabase, saveStudentProfileToSupabase } from './lib/supabase';
import { secureStorage } from './lib/security';
import { NoticeTicker } from './components/NoticeTicker';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CourseModal } from './components/CourseModal';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { GalleryModal } from './components/GalleryModal';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CoursesPage } from './pages/CoursesPage';
import { DownloadsPage } from './pages/DownloadsPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { StudentAuthPage } from './pages/StudentAuthPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminPage } from './pages/AdminPage';
import { Search, X, CheckCircle2, BookOpen, Download } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('home');
  const [loggedInStudent, setLoggedInStudent] = useState<StudentProfile | null>(null);

  // Active Modals
  const [activeCourseModal, setActiveCourseModal] = useState<Course | null>(null);
  const [activeDocModal, setActiveDocModal] = useState<DownloadItem | null>(null);
  const [activeGalleryModal, setActiveGalleryModal] = useState<GalleryItem | null>(null);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Initialize logged in student state from Supabase Auth or secure encrypted storage
  useEffect(() => {
    // 1. Check encrypted local storage cache
    try {
      const savedStudent = secureStorage.getItem<StudentProfile>('etc_logged_student');
      if (savedStudent) {
        setLoggedInStudent(savedStudent);
        setCurrentPage('dashboard');
      } else {
        const plainSaved = localStorage.getItem('etc_logged_student');
        if (plainSaved) {
          const student = JSON.parse(plainSaved);
          setLoggedInStudent(student);
          secureStorage.setItem('etc_logged_student', student);
          setCurrentPage('dashboard');
        }
      }
    } catch (e) {
      // do nothing
    }

    // 2. Listen to Supabase Auth state changes (e.g. Google OAuth, Email/Password)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const u = session.user;
        let student = await getStudentProfileFromSupabase(u.email || u.id);

        if (!student) {
          const newRoll = `ETC/2026/GOU-${Math.floor(100 + Math.random() * 900)}`;
          student = {
            id: u.id,
            rollNumber: newRoll,
            registrationNumber: `JK-ETC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'Authenticated Student',
            email: u.email || 'student@etc.edu.in',
            phone: u.user_metadata?.phone || '+91 9797 000111',
            guardianName: 'Guardian',
            dateOfBirth: '01/01/2004',
            gender: 'Male',
            address: 'Pulwama, Jammu & Kashmir',
            courseId: 'bht-101',
            courseTitle: 'Basic Horticulture Training Course (BHT)',
            batchYear: '2026 - 2027',
            photoUrl: u.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            bloodGroup: 'B +ve',
            cgpa: '8.80 / 10',
            semester: 'Semester I'
          };
          await saveStudentProfileToSupabase(student);
        }
        if (student) {
          setLoggedInStudent(student);
          secureStorage.setItem('etc_logged_student', student);
          setCurrentPage('dashboard');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleStudentLogin = (student: StudentProfile) => {
    setLoggedInStudent(student);
    try {
      secureStorage.setItem('etc_logged_student', student);
    } catch (e) {}
    setCurrentPage('dashboard');
    showToast(`Welcome back, ${student.name}! Accessing student portal.`);
  };

  const handleStudentLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    setLoggedInStudent(null);
    try {
      secureStorage.removeItem('etc_logged_student');
    } catch (e) {}
    setCurrentPage('home');
    showToast('Logged out of student portal.');
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  const handleApplySuccess = (courseTitle: string, applicantName: string) => {
    showToast(`Application pre-registered for ${applicantName} in ${courseTitle}`);
  };

  // Search Results
  const searchResultsCourses = COURSES.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const searchResultsDocs = DOWNLOADS_LIST.filter(d =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans text-slate-900 selection:bg-emerald-800 selection:text-white">
      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-400 flex items-center gap-3 animate-in slide-in-from-top duration-300 text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
          <span>{toastMsg}</span>
          <button onClick={() => setToastMsg(null)} className="text-emerald-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Header & Navbar */}
      <Header
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        loggedInStudent={loggedInStudent}
        onLogoutStudent={handleStudentLogout}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {/* Government Notice Ticker - Below Main Menu */}
      <NoticeTicker onSelectNotice={(notice) => showToast(`Issued: ${notice.title}`)} />

      {/* Page Content Body */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectCourse={(course) => setActiveCourseModal(course)}
            onApplyCourse={(course) => setActiveCourseModal(course)}
            onSelectNotice={(notice) => showToast(`Notice: ${notice.title}`)}
          />
        )}

        {currentPage === 'about' && <AboutPage />}

        {currentPage === 'courses' && (
          <CoursesPage
            onSelectCourse={(course) => setActiveCourseModal(course)}
            onApplyCourse={(course) => setActiveCourseModal(course)}
            onNavigate={(page) => setCurrentPage(page)}
          />
        )}

        {currentPage === 'downloads' && (
          <DownloadsPage
            onPreviewDocument={(doc) => setActiveDocModal(doc)}
          />
        )}

        {currentPage === 'gallery' && (
          <GalleryPage
            onSelectItem={(item) => setActiveGalleryModal(item)}
          />
        )}

        {currentPage === 'contact' && <ContactPage />}

        {currentPage === 'auth' && (
          <StudentAuthPage
            onLoginSuccess={handleStudentLogin}
            onNavigate={(page) => setCurrentPage(page)}
          />
        )}

        {currentPage === 'admin' && (
          <AdminPage
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'dashboard' && loggedInStudent && (
          <StudentDashboard
            student={loggedInStudent}
            onLogout={handleStudentLogout}
            onNavigate={(page) => setCurrentPage(page)}
          />
        )}

        {currentPage === 'dashboard' && !loggedInStudent && (
          <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Please Log In to Access Dashboard</h2>
            <p className="text-xs text-slate-500">You need to sign in with your student roll number first.</p>
            <button
              onClick={() => setCurrentPage('auth')}
              className="px-6 py-2.5 bg-emerald-800 text-white text-xs font-bold rounded-xl"
            >
              Go to Student Login
            </button>
          </div>
        )}
      </main>

      {/* Institutional Footer */}
      <Footer onNavigate={(page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      {/* Global Modals */}
      {activeCourseModal && (
        <CourseModal
          course={activeCourseModal}
          onClose={() => setActiveCourseModal(null)}
          onApplySuccess={handleApplySuccess}
        />
      )}

      {activeDocModal && (
        <DocumentViewerModal
          document={activeDocModal}
          onClose={() => setActiveDocModal(null)}
        />
      )}

      {activeGalleryModal && (
        <GalleryModal
          item={activeGalleryModal}
          onClose={() => setActiveGalleryModal(null)}
        />
      )}

      {/* Portal Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-start justify-center p-4 pt-16">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
              <Search className="w-5 h-5 text-emerald-800" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses (BHT, BAT), syllabus, forms..."
                className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4 text-xs">
              {searchQuery ? (
                <>
                  {searchResultsCourses.length > 0 && (
                    <div className="space-y-2">
                      <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
                        Courses Found ({searchResultsCourses.length})
                      </span>
                      {searchResultsCourses.map(c => (
                        <div
                          key={c.id}
                          onClick={() => {
                            setActiveCourseModal(c);
                            setSearchOpen(false);
                          }}
                          className="p-3 bg-slate-50 hover:bg-emerald-50 rounded-xl border border-slate-200 cursor-pointer flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-emerald-700" />
                            <span className="font-bold text-slate-900">{c.title}</span>
                          </div>
                          <span className="font-mono text-[10px] bg-amber-200 text-slate-950 px-2 py-0.5 rounded font-bold">
                            {c.code}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResultsDocs.length > 0 && (
                    <div className="space-y-2">
                      <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
                        Documents Found ({searchResultsDocs.length})
                      </span>
                      {searchResultsDocs.map(d => (
                        <div
                          key={d.id}
                          onClick={() => {
                            setActiveDocModal(d);
                            setSearchOpen(false);
                          }}
                          className="p-3 bg-slate-50 hover:bg-emerald-50 rounded-xl border border-slate-200 cursor-pointer flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Download className="w-4 h-4 text-emerald-700" />
                            <span className="font-bold text-slate-900">{d.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">{d.fileType}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResultsCourses.length === 0 && searchResultsDocs.length === 0 && (
                    <p className="text-slate-500 text-center py-6">No matching courses or documents found for "{searchQuery}".</p>
                  )}
                </>
              ) : (
                <div className="text-slate-400 text-center py-8">
                  Type a keyword like <strong className="text-emerald-700">BHT</strong>, <strong className="text-emerald-700">BAT</strong>, or <strong className="text-emerald-700">Syllabus</strong> to search the portal.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
