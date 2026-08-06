import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve saved keys from localStorage if configured by user, otherwise fallback to default env
const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('etc_supabase_url') : null;
const storedKey = typeof window !== 'undefined' ? localStorage.getItem('etc_supabase_key') : null;

export const DEFAULT_SUPABASE_URL = 'https://ssypyegksjrpjgbcoqyc.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_P19UWTAtI4Ujeg9HrYohqA_s6podg89';

export const activeSupabaseUrl = storedUrl || DEFAULT_SUPABASE_URL;
export const activeSupabaseKey = storedKey || DEFAULT_SUPABASE_ANON_KEY;

export let supabase: SupabaseClient = createClient(activeSupabaseUrl, activeSupabaseKey);

export function updateSupabaseConfig(url: string, key: string) {
  if (typeof window !== 'undefined') {
    if (url) localStorage.setItem('etc_supabase_url', url.trim());
    else localStorage.removeItem('etc_supabase_url');

    if (key) localStorage.setItem('etc_supabase_key', key.trim());
    else localStorage.removeItem('etc_supabase_key');
  }
  const newUrl = url.trim() || DEFAULT_SUPABASE_URL;
  const newKey = key.trim() || DEFAULT_SUPABASE_ANON_KEY;
  supabase = createClient(newUrl, newKey);
}

/**
 * Health check helper to verify Supabase database connection status
 */
export async function checkSupabaseConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    const { error } = await supabase.from('students').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      const isFetchErr = error.message?.toLowerCase().includes('fetch') || error.message?.toLowerCase().includes('network');
      return { connected: false, message: isFetchErr ? 'Cloud database unreachable (Local mode active)' : error.message };
    }
    return { connected: true, message: 'Supabase connection established successfully' };
  } catch (err: any) {
    return { connected: false, message: 'Cloud database unreachable (Local mode active)' };
  }
}

/**
 * Helper to compress base64 photos before uploading to Supabase REST payload
 */
export async function compressPhotoForSupabase(photoUrl: string): Promise<string> {
  if (!photoUrl || !photoUrl.startsWith('data:image')) {
    return photoUrl || '';
  }
  if (photoUrl.length < 40000) {
    return photoUrl;
  }
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxW = 220;
        const maxH = 260;
        let width = img.width || maxW;
        let height = img.height || maxH;
        if (width > maxW || height > maxH) {
          const ratio = Math.min(maxW / width, maxH / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);
          resolve(compressedDataUrl);
        } else {
          resolve(photoUrl.slice(0, 80000));
        }
      };
      img.onerror = () => resolve(photoUrl.slice(0, 50000));
      img.src = photoUrl;
    } catch (e) {
      resolve(photoUrl.slice(0, 50000));
    }
  });
}

/**
 * Helper to fetch all student profiles from Supabase database
 */
export async function fetchStudentsFromSupabase(): Promise<any[]> {
  try {
    const { data, error } = await supabase.from('students').select('*');
    if (error) {
      console.warn('Supabase fetch students warning:', error.message);
      return [];
    }
    return (data || []).map((row: any) => ({
      id: row.id,
      rollNumber: row.roll_number || row.rollNumber || row.roll_no || `ETC/2026/${row.id?.slice(0,4) || '101'}`,
      registrationNumber: row.registration_number || row.registrationNumber || `JK-ETC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: row.name || 'Registered Student',
      email: row.email || '',
      phone: row.phone || '',
      guardianName: row.guardian_name || row.guardianName || 'Guardian',
      dateOfBirth: row.date_of_birth || row.dateOfBirth || '01/01/2004',
      gender: row.gender || 'Male',
      qualification: row.qualification || '',
      district: row.district || '',
      address: row.address || 'Pulwama, Jammu & Kashmir',
      courseId: row.course_id || row.courseId || 'bht-101',
      courseTitle: row.course_title || row.courseTitle || 'Basic Horticulture Training Course (BHT)',
      batchYear: row.batch_year || row.batchYear || '2026 - 2027',
      enrollmentDate: row.enrollment_date || row.enrollmentDate || '',
      status: row.status || '',
      semester: row.semester || 'Semester I',
      photoUrl: row.photo_url || row.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bloodGroup: row.blood_group || row.bloodGroup || 'B +ve',
      cgpa: row.cgpa || 'Enrolled (Semester I)',
    }));
  } catch (e) {
    console.warn('Supabase fetch students error:', e);
    return [];
  }
}

/**
 * Helper to get a student profile from Supabase by user ID or Email or Roll Number with local storage fallback
 */
export async function getStudentProfileFromSupabase(identifier: string) {
  if (!identifier) return null;
  const queryClean = identifier.trim().toLowerCase();

  try {
    let data: any = null;

    // Try multi-field OR match
    try {
      const res = await supabase
        .from('students')
        .select('*')
        .or(`id.eq.${identifier},email.eq.${identifier},roll_number.eq.${identifier}`)
        .limit(1)
        .maybeSingle();
      if (res?.data) data = res.data;
    } catch (err) {}

    // Fallback: search by email
    if (!data) {
      try {
        const resEmail = await supabase.from('students').select('*').eq('email', identifier).limit(1).maybeSingle();
        if (resEmail?.data) data = resEmail.data;
      } catch (err) {}
    }

    // Fallback: search by roll_number
    if (!data) {
      try {
        const resRoll = await supabase.from('students').select('*').eq('roll_number', identifier).limit(1).maybeSingle();
        if (resRoll?.data) data = resRoll.data;
      } catch (err) {}
    }

    if (data) {
      // Map snake_case or standard fields to StudentProfile interface
      return {
        id: data.id,
        rollNumber: data.roll_number || data.rollNumber || data.roll_no || `ETC/2026/${data.id.slice(0,4)}`,
        registrationNumber: data.registration_number || data.registrationNumber || `JK-ETC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        name: data.name || 'Student',
        email: data.email,
        phone: data.phone || '+91 9797 000111',
        guardianName: data.guardian_name || data.guardianName || 'Guardian',
        dateOfBirth: data.date_of_birth || data.dateOfBirth || '01/01/2004',
        gender: data.gender || 'Male',
        qualification: data.qualification || '',
        district: data.district || '',
        address: data.address || 'Pulwama, Jammu & Kashmir',
        courseId: data.course_id || data.courseId || 'bht-101',
        courseTitle: data.course_title || data.courseTitle || 'Basic Horticulture Training Course (BHT)',
        batchYear: data.batch_year || data.batchYear || '2026 - 2027',
        enrollmentDate: data.enrollment_date || data.enrollmentDate || '',
        status: data.status || '',
        semester: data.semester || 'Semester I',
        photoUrl: data.photo_url || data.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        bloodGroup: data.blood_group || data.bloodGroup || 'B +ve',
        cgpa: data.cgpa || '8.80 / 10',
      };
    }
  } catch (e) {
    console.warn('Supabase get student profile network warning:', e);
  }

  // Fallback to local storage registered list if Supabase database query fails or yields no record
  try {
    const localStr = typeof window !== 'undefined' ? localStorage.getItem('etc_registered_students') : null;
    if (localStr) {
      const localList: any[] = JSON.parse(localStr);
      const match = localList.find((s: any) =>
        (s.id && s.id.toLowerCase() === queryClean) ||
        (s.email && s.email.toLowerCase() === queryClean) ||
        (s.rollNumber && s.rollNumber.toLowerCase() === queryClean)
      );
      if (match) return match;
    }
  } catch (localErr) {}

  return null;
}

/**
 * Helper to save student profile to Supabase with automatic schema detection, local backup, and offline safety
 */
export async function saveStudentProfileToSupabase(student: any): Promise<{ success: boolean; data?: any; error?: string }> {
  // 1. Always write to local storage first as a guaranteed offline backup
  try {
    if (typeof window !== 'undefined') {
      const existingStr = localStorage.getItem('etc_registered_students');
      const list: any[] = existingStr ? JSON.parse(existingStr) : [];
      const index = list.findIndex((s: any) => 
        (s.id && s.id === student.id) || 
        (s.email && s.email.toLowerCase() === (student.email || '').toLowerCase()) || 
        (s.rollNumber && s.rollNumber.toLowerCase() === (student.rollNumber || '').toLowerCase())
      );
      if (index >= 0) {
        list[index] = { ...list[index], ...student };
      } else {
        list.push(student);
      }
      localStorage.setItem('etc_registered_students', JSON.stringify(list));
    }
  } catch (localErr) {
    console.warn('Local backup save warning:', localErr);
  }

  // 2. Sync to Supabase cloud database
  try {
    const compactPhoto = await compressPhotoForSupabase(student.photoUrl || '');

    const snakeRecord = {
      id: student.id,
      roll_number: student.rollNumber,
      registration_number: student.registrationNumber,
      name: student.name,
      email: student.email,
      phone: student.phone,
      guardian_name: student.guardianName,
      date_of_birth: student.dateOfBirth,
      gender: student.gender,
      district: student.district || '',
      address: student.address,
      course_id: student.courseId,
      course_title: student.courseTitle,
      batch_year: student.batchYear,
      semester: student.semester,
      photo_url: compactPhoto,
      blood_group: student.bloodGroup,
      cgpa: student.cgpa,
    };

    // Primary upsert
    try {
      const { data: upsertData, error: upsertErr } = await supabase.from('students').upsert(snakeRecord).select();
      if (!upsertErr && upsertData) {
        return { success: true, data: upsertData };
      }
      console.error("Supabase upsert error:", upsertErr);
    } catch (upsertNetErr) {
      console.error("Supabase upsert net error:", upsertNetErr);
    }

    // Insert essential fields fallback
    try {
      const essentialRecord = {
        id: student.id,
        roll_number: student.rollNumber,
        registration_number: student.registrationNumber,
        name: student.name,
        email: student.email,
        phone: student.phone,
        guardian_name: student.guardianName,
        course_id: student.courseId,
        course_title: student.courseTitle,
        batch_year: student.batchYear,
        photo_url: compactPhoto
      };
      const { data: insertData, error: insertErr } = await supabase.from('students').insert([essentialRecord]).select();
      if (!insertErr && insertData) {
        return { success: true, data: insertData };
      }
      console.error("Supabase insert error:", insertErr);
    } catch (insertNetErr) {
      console.error("Supabase insert net error:", insertNetErr);
    }

    return { success: false, error: 'Failed to save to Supabase. Check console logs.' };
  } catch (e: any) {
    return { success: true, error: 'Record saved locally' };
  }
}

/**
 * Helper to upsert a student profile in Supabase
 */
export async function upsertStudentInSupabase(studentData: any) {
  try {
    const { data, error } = await supabase.from('students').upsert(studentData).select();
    if (error) {
      console.warn('Supabase upsert student warning:', error.message);
      return null;
    }
    return data;
  } catch (e) {
    console.warn('Supabase upsert student error:', e);
    return null;
  }
}
