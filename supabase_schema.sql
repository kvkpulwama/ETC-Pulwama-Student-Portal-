-- Drop the existing table to remove all previous details
DROP TABLE IF EXISTS public.students;

-- Create a fresh table with all fields for both Student and Admin registration
CREATE TABLE public.students (
    id TEXT PRIMARY KEY,
    roll_number TEXT UNIQUE,
    registration_number TEXT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    guardian_name TEXT,
    date_of_birth TEXT,
    gender TEXT,
    qualification TEXT,
    district TEXT,
    address TEXT,
    course_id TEXT,
    course_title TEXT,
    batch_year TEXT,
    enrollment_date TEXT,
    status TEXT,
    semester TEXT,
    attendance_percentage INTEGER,
    blood_group TEXT,
    hostel_status TEXT,
    stipend_status TEXT,
    cgpa TEXT,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

