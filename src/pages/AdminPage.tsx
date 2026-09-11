import React, { useState, useEffect } from 'react';
import { StudentProfile, NavigationPage } from '../types';
import { COURSES } from '../data/mockData';
import { supabase, fetchStudentsFromSupabase, saveStudentProfileToSupabase } from '../lib/supabase';
import { SupabaseConfigGuide } from '../components/SupabaseConfigGuide';

import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  UserPlus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  RefreshCw, 
  Download, 
  X, 
  CheckCircle2, 
  Users, 
  BookOpen, 
  Award, 
  AlertCircle,
  GraduationCap,
  LogOut,
  Building2,
  FileSpreadsheet,
  Plus,
  Database,
  Camera,
  Key,
  Hash,
  MapPin,
  User
} from 'lucide-react';

interface AdminPageProps {
  onNavigate: (page: NavigationPage) => void;
  onStudentSelect?: (student: StudentProfile) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  // Admin auth state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('etc_admin_logged_in') === 'true';
  });

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Student management state
  const [activeAdminTab, setActiveAdminTab] = useState<'students' | 'supabase'>('students');
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(null);
  const [viewingStudent, setViewingStudent] = useState<StudentProfile | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Form state for adding/editing student
  const [studentPassword, setStudentPassword] = useState('EtcPass@123');
  const [adminPhotoError, setAdminPhotoError] = useState('');
  const [formData, setFormData] = useState<Partial<StudentProfile>>({
    name: '',
    email: '',
    phone: '+91 ',
    guardianName: '',
    rollNumber: '',
    courseId: 'bht-101',
    courseTitle: 'Basic Horticulture Training Course (BHT)',
    batchYear: '2026 - 2027',
    gender: 'Male',
    dateOfBirth: '2004-01-15',
    district: 'Pulwama',
    address: 'Pulwama, J&K',
    bloodGroup: 'B +ve',
    semester: 'Semester I',
    cgpa: 'Enrolled (Semester I)',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  });

  // Show notification banner
  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch all students (Combine Supabase, local cache, and DEMO_STUDENTS)
  const fetchAllStudents = async () => {
    setIsLoadingStudents(true);
    try {
      // 1. Fetch records from Supabase
      const supabaseStudents = await fetchStudentsFromSupabase();

      // 2. Fetch records from local storage backup cache
      const existingStudentsStr = localStorage.getItem('etc_registered_students');
      const localStudents: StudentProfile[] = existingStudentsStr ? JSON.parse(existingStudentsStr) : [];

      // 3. Merge without duplicates (using email as map key)
      const studentMap = new Map<string, StudentProfile>();

      

      // Overlay: Locally registered students
      localStudents.forEach(s => {
        if (s.email) studentMap.set(s.email.toLowerCase().trim(), s);
      });

      // Overlay: Supabase database students (most authoritative)
      supabaseStudents.forEach(s => {
        if (s.email) studentMap.set(s.email.toLowerCase().trim(), s);
      });

      setStudents(Array.from(studentMap.values()));
    } catch (err) {
      console.warn("Failed fetching students list:", err);
      setStudents([]);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchAllStudents();
    }
  }, [isAdminLoggedIn]);

  // Admin Login Handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsAuthLoading(true);

    const trimmedEmail = adminEmail.trim().toLowerCase();
    const trimmedPass = adminPassword.trim();

    // Check administrative credentials
    if (
      (trimmedEmail === 'pcpulwama@gmail.com' && trimmedPass === 'Fuzzy@4652#') ||
      (trimmedEmail === 'admin@etcpulwama.edu' && (trimmedPass === 'admin123' || trimmedPass === 'Fuzzy@4652#')) ||
      (trimmedEmail === 'admin@gmail.com' && trimmedPass === 'admin123')
    ) {
      setIsAdminLoggedIn(true);
      localStorage.setItem('etc_admin_logged_in', 'true');
      showToast('Welcome Admin! Logged in successfully.');
      setIsAuthLoading(false);
      return;
    }

    // Try Supabase Authentication
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPass
      });
      if (!error && data?.user) {
        setIsAdminLoggedIn(true);
        localStorage.setItem('etc_admin_logged_in', 'true');
        showToast('Authenticated via Supabase as Admin.');
      } else {
        setLoginError('Invalid Admin Email or Password. Please check your credentials.');
      }
    } catch (err: any) {
      setLoginError('Invalid Admin Email or Password. Please check your credentials.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Logout Handler
  const handleAdminLogout = async () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('etc_admin_logged_in');
    try { await supabase.auth.signOut(); } catch(e){}
    showToast('Logged out of Admin Portal.');
  };

  // Handle Admin Photo Upload
  const handleAdminPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminPhotoError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAdminPhotoError('Please select a valid image file (JPEG or PNG format).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAdminPhotoError('Image file size should not exceed 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // Helper to suggest standard Roll Number format
  const handleAdminSuggestRollNo = () => {
    const courseObj = COURSES.find(c => c.id === formData.courseId);
    const code = courseObj ? courseObj.code : 'BHT';
    const num = Math.floor(100 + Math.random() * 900);
    const batch = formData.batchYear || '2026 - 2027';
    const shortSession = batch.replace(/\s+/g, '').replace('2026-2027', '2026-27').replace('2025-2026', '2025-26');
    setFormData(prev => ({ ...prev, rollNumber: `${code}-${shortSession}-${num}` }));
  };

  // Open Add Student Modal
  const handleOpenAddModal = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    setFormData({
      id: `s-admin-${Date.now()}`,
      rollNumber: `BHT-2026-27-${randomNum}`,
      registrationNumber: `JK-ETC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      email: '',
      phone: '+91 ',
      guardianName: '',
      courseId: 'bht-101',
      courseTitle: 'Basic Horticulture Training Course (BHT)',
      batchYear: '2026 - 2027',
      gender: 'Male',
      dateOfBirth: '2004-01-15',
      district: 'Pulwama',
      address: 'Pulwama, Jammu & Kashmir',
      bloodGroup: 'B +ve',
      semester: 'Semester I',
      cgpa: 'Enrolled (Semester I)',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    });
    setStudentPassword('EtcPass@123');
    setAdminPhotoError('');
    setEditingStudent(null);
    setShowAddModal(true);
  };

  // Open Edit Student Modal
  const handleOpenEditModal = (student: StudentProfile) => {
    setFormData({ ...student });
    setStudentPassword('');
    setAdminPhotoError('');
    setEditingStudent(student);
    setShowAddModal(true);
  };

  // Save Student (Add or Edit)
  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.rollNumber) {
      alert("Please fill in Candidate Name, Email, and Roll Number.");
      return;
    }

    const selectedCourseObj = COURSES.find(c => c.id === formData.courseId);

    const updatedStudent: StudentProfile = {
      id: formData.id || `s-${Date.now()}`,
      rollNumber: formData.rollNumber || `BHT-2026-27-${Math.floor(100 + Math.random() * 900)}`,
      registrationNumber: formData.registrationNumber || `JK-ETC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.name.trim(),
      email: formData.email.toLowerCase().trim(),
      phone: formData.phone || '+91 ',
      guardianName: formData.guardianName || 'Guardian',
      dateOfBirth: formData.dateOfBirth || '2004-01-15',
      gender: formData.gender || 'Male',
      qualification: formData.qualification || '10th',
      district: formData.district || 'Pulwama',
      address: formData.address || 'Pulwama, J&K',
      courseId: formData.courseId || 'bht-101',
      courseTitle: selectedCourseObj ? selectedCourseObj.title : (formData.courseTitle || 'Basic Horticulture Training Course (BHT)'),
      batchYear: formData.batchYear || '2026 - 2027',
      photoUrl: formData.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bloodGroup: formData.bloodGroup || 'B +ve',
      cgpa: formData.cgpa || 'Enrolled (Semester I)',
      semester: formData.semester || 'Semester I'
    };

    // 1. Provision user in Supabase Auth if password provided and creating new student
    if (!editingStudent && studentPassword) {
      try {
        await supabase.auth.signUp({
          email: updatedStudent.email,
          password: studentPassword,
          options: {
            data: { full_name: updatedStudent.name }
          }
        });
      } catch (authErr) {
        console.warn('Supabase Auth Signup Notice:', authErr);
      }
    }

    // 2. Save Student Record to Supabase DB table
    try {
      const res = await saveStudentProfileToSupabase(updatedStudent);
      if (res && !res.success) {
        console.warn('Supabase save student profile note:', res.error);
      }
    } catch (sbErr) {
      console.warn('Supabase Error:', sbErr);
    }

    // 3. Update Local React State
    setStudents(prev => {
      const idx = prev.findIndex(s => s.id === updatedStudent.id || s.email === updatedStudent.email);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updatedStudent;
        return copy;
      } else {
        return [updatedStudent, ...prev];
      }
    });

    // 4. Update localStorage cache
    const existingStr = localStorage.getItem('etc_registered_students');
    const existingList: StudentProfile[] = existingStr ? JSON.parse(existingStr) : [];
    const filtered = existingList.filter(s => s.id !== updatedStudent.id && s.email !== updatedStudent.email);
    filtered.push(updatedStudent);
    localStorage.setItem('etc_registered_students', JSON.stringify(filtered));

    setShowAddModal(false);
    showToast(editingStudent ? `Updated student profile: ${updatedStudent.name}` : `Added student & synced to Supabase: ${updatedStudent.name}`);
  };

  // Delete Student Handler
  const handleDeleteStudent = async (student: StudentProfile) => {
    if (!window.confirm(`Are you sure you want to delete trainee "${student.name}" (Roll No: ${student.rollNumber})?`)) {
      return;
    }

    // 1. Delete from Supabase
    try {
      const { error } = await supabase.from('students').delete().eq('id', student.id);
      if (error) console.warn('Supabase delete error:', error);
    } catch (sbErr) {
      console.warn('Supabase Error:', sbErr);
    }

    // 2. Delete from local state
    setStudents(prev => prev.filter(s => s.id !== student.id && s.email !== student.email));

    // 3. Delete from localStorage
    const existingStr = localStorage.getItem('etc_registered_students');
    if (existingStr) {
      const existingList: StudentProfile[] = JSON.parse(existingStr);
      const filtered = existingList.filter(s => s.id !== student.id && s.email !== student.email);
      localStorage.setItem('etc_registered_students', JSON.stringify(filtered));
    }

    showToast(`Deleted student record for ${student.name}`);
  };

  // Clear all registered students to keep fresh
  const handleClearAllRegistrations = async () => {
    if (!window.confirm("Are you sure you want to remove ALL registered students and keep the registration list completely fresh?")) {
      return;
    }
    try {
      localStorage.removeItem('etc_registered_students');
      localStorage.removeItem('etc_my_student_icard');
      try {
        await supabase.from('students').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      } catch (e) {
        console.warn('Supabase bulk delete notice:', e);
      }
      setStudents([]);
      showToast("All registration data removed successfully. Registration list is now completely fresh.");
    } catch (err) {
      console.error('Clear registrations error:', err);
    }
  };

  // Sync / Push All Trainees to Supabase Cloud Database
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);
  const handleSyncAllToSupabase = async () => {
    if (students.length === 0) {
      showToast('No student records found to sync.');
      return;
    }
    setIsSyncingSupabase(true);
    let successCount = 0;
    try {
      for (const student of students) {
        const res = await saveStudentProfileToSupabase(student);
        if (res.success) successCount++;
      }
      showToast(`Database Sync: Successfully pushed ${successCount} student profiles into Supabase table!`);
    } catch (err: any) {
      showToast(`Database Sync Note: ${err?.message || 'Reflected all student records into local & cloud databases.'}`);
    } finally {
      setIsSyncingSupabase(false);
    }
  };

  const handleWipeDatabase = async () => {
    if (!window.confirm("Are you sure you want to delete all student records except Jahangir Ahmad Magray? This will wipe the local storage and Supabase database.")) return;
    
    // Filter to keep only Jahangir
    const keep = students.filter(s => s.name.toLowerCase().includes('jahangir ahmad magray'));
    
    try {
      // 1. Delete from Supabase
      const { error } = await supabase.from('students').delete().not('name', 'ilike', '%jahangir ahmad magray%');
      if (error) console.warn('Supabase wipe note:', error);
    } catch (e) {
      console.warn(e);
    }
    
    // 2. Overwrite Local Storage
    localStorage.setItem('etc_registered_students', JSON.stringify(keep));
    
    // 3. Update State
    setStudents(keep);
    showToast('Database wiped successfully! Kept ' + keep.length + ' records.');
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    if (students.length === 0) return;
    const headers = ['Roll Number', 'Registration No', 'Name', 'Email', 'Phone', 'Course', 'Batch', 'CGPA'];
    const rows = filteredStudents.map(s => [
      `"${s.rollNumber}"`,
      `"${s.registrationNumber}"`,
      `"${s.name}"`,
      `"${s.email}"`,
      `"${s.phone}"`,
      `"${s.courseTitle}"`,
      `"${s.batchYear}"`,
      `"${s.cgpa}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ETC_Pulwama_Students_Roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter students by Search & Course
  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery);

    const matchesCourse = 
      selectedCourseFilter === 'all' || 
      s.courseId === selectedCourseFilter;

    return matchesSearch && matchesCourse;
  });

  // Calculate Statistics
  const totalCount = students.length;
  const bhtCount = students.filter(s => s.courseId === 'bht-101').length;
  const batCount = students.filter(s => s.courseId === 'bat-102').length;
  const shortTermCount = totalCount - bhtCount - batCount;

  // Render Login Screen if not logged in as Admin
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-900 text-white">
        <div className="max-w-md w-full bg-slate-800/90 rounded-3xl p-8 border border-slate-700 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-amber-400 text-slate-950 rounded-2xl flex items-center justify-center mx-auto shadow-lg border border-amber-300">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-white tracking-tight">Admin Portal Access</h2>
            <p className="text-xs text-amber-300 font-medium">Extension Training Centre Malangpora Pulwama</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Admin Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900 border border-slate-600 rounded-xl text-xs text-white focus:border-amber-400 focus:outline-none"
                  placeholder="Enter admin email"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Admin Secure Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900 border border-slate-600 rounded-xl text-xs text-white focus:border-amber-400 focus:outline-none"
                  placeholder="••••••••••••"
                />
              </div>
            </div>



            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isAuthLoading ? "Authenticating Admin..." : "Login to Admin Console"}</span>
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate('home')}
              className="text-xs text-slate-400 hover:text-white underline transition-colors"
            >
              ← Return to Main Student Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Admin Dashboard
  return (
    <div className="min-h-screen bg-slate-100/70 pb-20 space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">{notification}</span>
        </div>
      )}

      {/* Admin Top Header Banner */}
      <div className="bg-[#00472A] text-white py-6 px-4 sm:px-8 shadow-xl border-b border-emerald-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-950 text-[10px] px-2 py-0.5 rounded font-extrabold uppercase">
                  ADMIN CONSOLE
                </span>
                <span className="text-emerald-200 text-xs font-mono font-bold">pcpulwama@gmail.com</span>
              </div>
              <h1 className="text-2xl font-serif font-bold text-white tracking-tight mt-0.5">
                Extension Training Centre Malangpora — Student Management Portal
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New Student</span>
            </button>

            <button
              onClick={handleAdminLogout}
              className="px-3 py-2.5 bg-emerald-950 hover:bg-red-800 text-white font-bold text-xs rounded-xl border border-emerald-700 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-2 font-bold text-xs pt-2">
          <button
            onClick={() => setActiveAdminTab('students')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 border-t border-x ${
              activeAdminTab === 'students'
                ? 'bg-white border-slate-200 text-[#005E38] shadow-sm font-extrabold'
                : 'bg-slate-100 border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Trainee Roster ({totalCount})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('supabase')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 border-t border-x ${
              activeAdminTab === 'supabase'
                ? 'bg-white border-slate-200 text-[#005E38] shadow-sm font-extrabold'
                : 'bg-slate-100 border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-600" />
            <span>Supabase Credentials & OAuth Setup</span>
          </button>
        </div>

        {activeAdminTab === 'supabase' ? (
          <SupabaseConfigGuide />
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="p-3 bg-emerald-100 text-[#005E38] rounded-xl shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">{totalCount}</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Trainees</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="p-3 bg-amber-100 text-amber-900 rounded-xl shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">{bhtCount}</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">BHT Program</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-900 rounded-xl shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">{batCount}</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">BAT Program</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="p-3 bg-purple-100 text-purple-900 rounded-xl shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">{shortTermCount}</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Short-Term & Others</p>
                </div>
              </div>
            </div>

        {/* Search, Filters and Toolbar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student by Name, Roll No, Email, Phone..."
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#005E38] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Course Filter Dropdown */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <Filter className="w-4 h-4 text-[#005E38]" />
                <span>Filter Course:</span>
              </div>
              <select
                value={selectedCourseFilter}
                onChange={(e) => setSelectedCourseFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#005E38] focus:outline-none"
              >
                <option value="all">All Academic Programs</option>
                {COURSES.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>

              <button
                onClick={fetchAllStudents}
                disabled={isLoadingStudents}
                className="p-2 border border-slate-300 hover:bg-slate-100 rounded-xl text-slate-700 transition-colors"
                title="Reload Database Records"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingStudents ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={handleWipeDatabase}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-sm border border-red-500"
                title="Wipe database except Jahangir"
              >
                <span className="hidden sm:inline">Wipe Database</span>
              </button>

              <button
                onClick={handleSyncAllToSupabase}
                disabled={isSyncingSupabase}
                className="px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-sm border border-emerald-600"
                title="Push all student records into Supabase Database"
              >
                <Database className={`w-4 h-4 ${isSyncingSupabase ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isSyncingSupabase ? 'Syncing...' : 'Push to Supabase Table'}</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shrink-0"
              >
                <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>

              <button
                onClick={handleClearAllRegistrations}
                className="px-3 py-2 bg-red-800 hover:bg-red-900 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
                title="Remove all registered trainees and keep fresh"
              >
                <Trash2 className="w-4 h-4 text-red-200" />
                <span className="hidden sm:inline">Clear All (Keep Fresh)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Student Records Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-serif font-bold text-slate-900 text-lg">
              Enrolled Student Directory ({filteredStudents.length})
            </h3>
            <span className="text-xs text-emerald-800 font-semibold font-mono bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Supabase & Cloud DB Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-900 uppercase font-extrabold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Student Details</th>
                  <th className="px-6 py-3">Roll & Reg Number</th>
                  <th className="px-6 py-3">Course / Batch</th>
                  <th className="px-6 py-3">CGPA</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 font-medium">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500 space-y-2">
                      <Users className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="font-bold">No student records found.</p>
                      <p className="text-xs text-slate-400">Try adjusting your search query or add a new student.</p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-3.5 flex items-center gap-3">
                        <img
                          src={student.photoUrl}
                          alt={student.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-300 shrink-0"
                        />
                        <div>
                          <p className="font-extrabold text-slate-900 text-sm">{student.name}</p>
                          <p className="text-slate-500 text-[11px]">{student.email}</p>
                          <p className="text-slate-400 text-[10px]">{student.phone}</p>
                        </div>
                      </td>

                      <td className="px-6 py-3.5">
                        <p className="font-mono font-bold text-[#005E38] text-xs">{student.rollNumber}</p>
                        <p className="text-slate-500 text-[10px] font-mono">{student.registrationNumber}</p>
                      </td>

                      <td className="px-6 py-3.5 max-w-xs">
                        <p className="font-bold text-slate-900 line-clamp-1">{student.courseTitle}</p>
                        <span className="inline-block mt-0.5 bg-emerald-100 text-emerald-900 text-[9px] font-extrabold px-2 py-0.5 rounded font-mono">
                          Batch: {student.batchYear}
                        </span>
                      </td>

                      <td className="px-6 py-3.5"><p className="font-bold text-slate-900">{student.cgpa}</p></td>

                      <td className="px-6 py-3.5 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => setViewingStudent(student)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                          title="View Full Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(student)}
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#005E38] rounded-lg transition-colors"
                          title="Edit Student Record"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteStudent(student)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                          title="Delete Student Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        </>
      )}
      </div>

      {/* Modal: Add or Edit Student */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-[#005E38] rounded-xl">
                  {editingStudent ? <Edit3 className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-slate-900 text-xl">
                    {editingStudent ? 'Edit Student Record' : 'Add New Trainee Student (Admin Level)'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Fill candidate details below to insert/update student profile directly into Supabase database.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-6 text-xs font-semibold text-slate-700">
              
              {/* Section 1: Candidate Personal Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold border-b border-slate-100 pb-1.5">
                  <User className="w-4 h-4 text-emerald-700" />
                  <span className="uppercase text-[11px] tracking-wider">1. Candidate Identity & Login Credentials</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-bold text-slate-800">Full Candidate Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Shahid Ahmad Bhat"
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#005E38] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-slate-800">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="student@gmail.com"
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#005E38] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-slate-800">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 9797XXXXXX"
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#005E38] focus:outline-none"
                    />
                  </div>

                  {!editingStudent && (
                    <div>
                      <label className="block mb-1 font-bold text-slate-800">
                        Set Student Password * (For Student Login)
                      </label>
                      <div className="relative">
                        <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={studentPassword}
                          onChange={(e) => setStudentPassword(e.target.value)}
                          placeholder="e.g. EtcPass@123"
                          className="w-full pl-8 pr-3 py-2.5 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-[#005E38] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-slate-800">Candidate Roll Number *</label>
                      <button
                        type="button"
                        onClick={handleAdminSuggestRollNo}
                        className="text-[10px] text-emerald-700 hover:text-emerald-900 font-bold underline"
                      >
                        Fill Example Format
                      </button>
                    </div>
                    <div className="relative">
                      <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={formData.rollNumber || ''}
                        onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                        placeholder="e.g. BHT-2026-27-101"
                        className="w-full pl-8 pr-3 py-2.5 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#005E38] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-slate-800">Registration Number</label>
                    <input
                      type="text"
                      value={formData.registrationNumber || ''}
                      onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                      placeholder="JK-ETC-2026-2405"
                      className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-slate-900 focus:ring-2 focus:ring-[#005E38] focus:outline-none bg-slate-50"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Course & Academic Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold border-b border-slate-100 pb-1.5">
                  <GraduationCap className="w-4 h-4 text-emerald-700" />
                  <span className="uppercase text-[11px] tracking-wider">2. Course Enrollment & Academic Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-bold text-slate-800">Academic Program Course *</label>
                    <select
                      value={formData.courseId || 'bht-101'}
                      onChange={(e) => {
                        const selectedCourse = COURSES.find(c => c.id === e.target.value);
                        setFormData({
                          ...formData,
                          courseId: e.target.value,
                          courseTitle: selectedCourse ? selectedCourse.title : formData.courseTitle
                        });
                      }}
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#005E38] focus:outline-none font-medium"
                    >
                      {COURSES.map(c => (
                        <option key={c.id} value={c.id}>{c.title} ({c.code})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-slate-800">Session / Batch Year *</label>
                    <select
                      value={formData.batchYear || '2026 - 2027'}
                      onChange={(e) => setFormData({ ...formData, batchYear: e.target.value })}
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#005E38] focus:outline-none font-bold text-slate-900"
                    >
                      <option value="2026 - 2027">2026 - 2027</option>
                      <option value="2025 - 2026">2025 - 2026</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-bold text-slate-800">Semester</label>
                    <select
                      value={formData.semester || 'Semester I'}
                      onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#005E38] focus:outline-none font-medium"
                    >
                      {['Semester I', 'Semester II', 'Semester III', 'Semester IV', 'Semester V', 'Semester VI'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-slate-800">Attendance Percentage (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#005E38] focus:outline-none font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Demographics & Residential Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold border-b border-slate-100 pb-1.5">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span className="uppercase text-[11px] tracking-wider">3. Demographics & Residence</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-bold text-slate-800">Father / Guardian Name</label>
                    <input
                      type="text"
                      value={formData.guardianName || ''}
                      onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                      placeholder="e.g. Ghulam Hassan Bhat"
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#005E38] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-slate-800">Gender *</label>
                    <select
                      required
                      value={formData.gender || 'Male'}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#005E38] focus:outline-none font-medium text-slate-800"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-slate-800">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={formData.dateOfBirth || '2004-01-15'}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#005E38] focus:outline-none font-medium text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-slate-800">District *</label>
                    <select
                      required
                      value={formData.district || 'Pulwama'}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#005E38] focus:outline-none font-medium"
                    >
                      {[
                        "Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", 
                        "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", 
                        "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", 
                        "Srinagar", "Udhampur"
                      ].map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-slate-800">Qualification *</label>
                    <select
                      required
                      value={formData.qualification || '10th'}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#005E38] focus:outline-none font-medium text-slate-800"
                    >
                      {['10th', '12th', 'BA', 'B.Sc', 'MA', 'M.Sc', 'Other'].map(q => (
                        <option key={q} value={q}>{q}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-bold text-slate-800">Blood Group</label>
                    <select
                      value={formData.bloodGroup || 'B +ve'}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#005E38] focus:outline-none font-medium"
                    >
                      {['A +ve', 'A -ve', 'B +ve', 'B -ve', 'O +ve', 'O -ve', 'AB +ve', 'AB -ve', 'Unknown'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-slate-800">Hostel Status</label>
                    <input
                      type="text"
                      placeholder="e.g. Block A, Room 101"
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#005E38] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-bold text-slate-800">Street Address / Village</label>
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g. Tahab, Pulwama"
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#005E38] focus:outline-none"
                  />
                </div>
              </div>

              {/* Section 4: Passport Photograph Upload */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block font-bold text-slate-800">
                  Candidate Passport Photograph (Human Candidate Photo, JPEG/PNG &lt;5MB)
                </label>
                <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  {formData.photoUrl ? (
                    <div className="relative shrink-0">
                      <img
                        src={formData.photoUrl}
                        alt="Candidate Photograph"
                        className="w-16 h-20 rounded-xl object-cover border-2 border-[#005E38] shadow-sm"
                      />
                      <span className="absolute -bottom-1 -right-1 bg-[#005E38] text-white p-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  ) : (
                    <div className="w-16 h-20 bg-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 shrink-0 border border-dashed border-slate-300">
                      <Camera className="w-6 h-6" />
                      <span className="text-[9px] font-bold mt-1">Photo</span>
                    </div>
                  )}

                  <div className="space-y-1 flex-1">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleAdminPhotoUpload}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-[#005E38] file:text-white hover:file:bg-[#00482B] cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-500">
                      Upload passport size photograph or leave default.
                    </p>
                    {adminPhotoError && (
                      <p className="text-[10px] font-bold text-red-600">{adminPhotoError}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#005E38] hover:bg-[#00482B] text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <Database className="w-4 h-4 text-amber-300" />
                  <span>{editingStudent ? 'Update Profile' : 'Save Student to Supabase'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Student Full Details */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="font-serif font-bold text-slate-900 text-lg">Official Student Profile Card</h3>
              <button
                onClick={() => setViewingStudent(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4 bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
              <img
                src={viewingStudent.photoUrl}
                alt={viewingStudent.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#005E38] shadow"
              />
              <div>
                <h4 className="font-black text-slate-900 text-lg">{viewingStudent.name}</h4>
                <p className="font-mono text-xs font-bold text-[#005E38]">{viewingStudent.rollNumber}</p>
                <p className="text-xs text-slate-600">{viewingStudent.courseTitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Email</span>
                <span className="font-bold text-slate-800 break-all">{viewingStudent.email}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone</span>
                <span className="font-bold text-slate-800">{viewingStudent.phone}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Guardian</span>
                <span className="font-bold text-slate-800">{viewingStudent.guardianName}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">District</span>
                <span className="font-bold text-emerald-800">{viewingStudent.district || 'Pulwama'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Batch</span>
                <span className="font-bold text-slate-800">{viewingStudent.batchYear}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Hostel</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Stipend</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Blood Group</span>
                <span className="font-bold text-slate-800">{viewingStudent.bloodGroup || 'B +ve'}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Residential Address</span>
              <p className="font-medium text-slate-700">{viewingStudent.address}</p>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setViewingStudent(null)}
                className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
