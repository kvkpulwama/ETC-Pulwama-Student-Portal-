export type NavigationPage = 'home' | 'about' | 'courses' | 'idcard' | 'downloads' | 'gallery' | 'contact' | 'auth' | 'dashboard' | 'admin';

export interface Course {
  id: string;
  code: string;
  title: string;
  category: 'Long-Term Diploma' | 'Short-Term Training' | 'Vocational Certificate';
  duration: string;
  eligibility: string;
  seats: number;
  stipendOrFee: string;
  description: string;
  objectives: string[];
  modules: {
    semesterOrTerm: string;
    subjects: {
      name: string;
      code: string;
      creditsOrHours: string;
      description: string;
    }[];
  }[];
  instructor: {
    name: string;
    designation: string;
  };
  image: string;
  tags: string[];
  batchDates: string;
}

export interface DownloadItem {
  id: string;
  title: string;
  category: 'Admission Forms' | 'Syllabus & Curricula' | 'Exam Date Sheets' | 'Study Material' | 'Certificates & Requests';
  fileType: 'PDF' | 'DOCX' | 'ZIP';
  fileSize: string;
  uploadDate: string;
  downloadsCount: number;
  description: string;
  directUrl?: string;
  contentPreview?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Field Visits' | 'Practical Sessions' | 'Campus & Orchard' | 'Labs & Research' | 'Events & Ceremonies';
  imageUrl: string;
  date: string;
  location: string;
  description: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  date: string;
  category: 'Admissions' | 'Exams' | 'Events' | 'General';
  isImportant?: boolean;
  link?: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  department: string;
  experience: string;
  email: string;
  image: string;
  specialization: string;
}

export interface StudentProfile {
  id: string;
  rollNumber: string;
  registrationNumber: string;
  name: string;
  email: string;
  phone: string;
  guardianName: string;
  dateOfBirth: string;
  gender: string;
  qualification?: string;
  district?: string;
  address: string;
  courseId: string;
  courseTitle: string;
  batchYear: string;
  enrollmentDate?: string;
  status?: string;
  semester?: string;
  photoUrl?: string;
  bloodGroup?: string;
  cgpa?: string;
  division?: string;
  validUpto?: string;
  emergencyContact?: string;
  designation?: string;
}

export interface StudentMark {
  subjectCode: string;
  subjectName: string;
  maxMarks: number;
  obtainedMarks: number;
  grade: string;
  status: 'Pass' | 'Fail' | 'Pending';
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'Pending' | 'Submitted' | 'Graded';
  marksObtained?: string;
  downloadUrl?: string;
}

export interface TimetableEntry {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  time: string;
  subject: string;
  type: 'Theory Lecture' | 'Field Practical' | 'Lab Session';
  venue: string;
  faculty: string;
}

export interface ContactQuery {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  trackingCode: string;
}

export interface CertificateData {
  regdNo: string;
  srNo: string;
  candidateName: string;
  genderPrefix: string;
  parentage: string;
  relationType: string;
  residence: string;
  district: string;
  courseCode: 'BHT' | 'BAT';
  courseName: string;
  session: string;
  division: string;
  dateOfIssue: string;
  verificationCode?: string;
}
