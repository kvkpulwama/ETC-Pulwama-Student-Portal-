CREATE TABLE public.students (
    id TEXT PRIMARY KEY,
    roll_number TEXT UNIQUE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    guardian_name TEXT,
    address TEXT,
    district TEXT,
    course_id TEXT,
    batch_year TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
