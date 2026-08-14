import { Course, DownloadItem, GalleryItem, NoticeItem, FacultyMember, StudentProfile, StudentMark, Assignment, TimetableEntry } from '../types';
import profMuglooImg from '../assets/images/prof-mugloo.jpg';

export const INSTITUTION_INFO = {
  name: 'Extension Training Centre (ETC) Pulwama',
  subHeading: 'Department of Agriculture Production & Farmers Welfare, Govt. of Jammu & Kashmir',
  tagline: 'Empowering Rural Youth & Extension Personnel through Modern Agricultural & Horticultural Science',
  address: 'Koil Road, Near District Complex, Pulwama, Jammu & Kashmir - 192301',
  phone: '+91 1933 262245',
  helpline: '+91 1933 262111',
  email: 'principal.etcpulwama@jk.gov.in',
  altEmail: 'info@etcpulwama.edu',
  domain: 'etcpulwama.edu',
  website: 'https://etcpulwama.edu',
  established: '1978',
  campusArea: '35 Acres (Orchard, Hi-Tech Nursery, Organic Farm & Labs)',
  principalName: 'Dr. Javeed Ahmad Mugloo',
  principalDesignation: 'Prof. & Head',
  principalPhoto: '/prof-mugloo-final.jpg',
  principalMessage: 'Welcome to Extension Training Centre Pulwama. Our mission is to impart technical hands-on training in temperate horticulture, modern agronomy, organic farming, and hi-tech greenhouse management to youth and field extension personnel of J&K.'
};

export const NOTICES: NoticeItem[] = [
  {
    id: 'n-1',
    title: 'Admissions Open for Basic Horticulture Training Course (BHT) & Basic Agriculture Training Course (BAT) Batch 2026-27',
    date: '28 July 2026',
    category: 'Admissions',
    isImportant: true
  },
  {
    id: 'n-2',
    title: 'Date Sheet for Semester-II Final Examinations of BHT & BAT Candidates Announced',
    date: '25 July 2026',
    category: 'Exams',
    isImportant: true
  },
  {
    id: 'n-3',
    title: 'Special 1-Month Hands-on Workshop on High-Density Apple Nursery Management & Grafting Techniques',
    date: '20 July 2026',
    category: 'Events',
    isImportant: false
  },
  {
    id: 'n-4',
    title: 'Distribution of Monthly Government Stipend for Enrolled Candidates for Q1 2026',
    date: '15 July 2026',
    category: 'General',
    isImportant: false
  },
  {
    id: 'n-5',
    title: 'Tender Notice for Supply of Soil Testing Reagents & Greenhouse Polyhouse Equipment',
    date: '10 July 2026',
    category: 'General',
    isImportant: false
  }
];

export const COURSES: Course[] = [
  {
    id: 'bht-101',
    code: 'BHT-101',
    title: 'Basic Horticulture Training Course',
    category: 'Long-Term Diploma',
    duration: '1 Year (2 Semesters)',
    eligibility: '10+2 Pass in Science / Agriculture Stream (Min 50% Marks)',
    seats: 40,
    stipendOrFee: 'Govt. Sponsored (Rs. 1,500/month Stipend to selected J&K candidates)',
    description: 'The Basic Horticulture Training Course (BHT) is the flagship 1-year diploma program at ETC Pulwama designed to train students in temperate pomology, canopy management, modern orchard establishment, vegetable production, floriculture, and plant propagation techniques.',
    objectives: [
      'Master high-density orchard management and rootstock grafting for apple, pear, cherry, and walnut.',
      'Gain practical knowledge in soil fertility management, fertigation, and integrated pest management (IPM).',
      'Learn post-harvest technology, cold chain management, grading, and packaging of Kashmir fruits.',
      'Develop field extension skillsets to advise local fruit growers and farming communities.'
    ],
    modules: [
      {
        semesterOrTerm: 'Semester I: Foundations of Pomology & Plant Protection',
        subjects: [
          { name: 'Principles of Temperate Fruit Production', code: 'BHT-11', creditsOrHours: '60 Hrs Theory / 90 Hrs Field', description: 'Study of apple, pear, peach, plum, and cherry cultivation in J&K conditions.' },
          { name: 'Plant Nursery & Canopy Management', code: 'BHT-12', creditsOrHours: '40 Hrs Theory / 80 Hrs Field', description: 'Grafting, budding, stool beds, and training of fruit trees.' },
          { name: 'Horticultural Entomology & Pathology', code: 'BHT-13', creditsOrHours: '50 Hrs Theory / 60 Hrs Lab', description: 'Identification & management of apple scab, red spider mite, and san jose scale.' }
        ]
      },
      {
        semesterOrTerm: 'Semester II: Olericulture, Post-Harvest & Extension',
        subjects: [
          { name: 'Commercial Vegetable Science & Greenhouse Tech', code: 'BHT-21', creditsOrHours: '50 Hrs Theory / 70 Hrs Field', description: 'Cultivation of exotic and indigenous vegetables under protected structures.' },
          { name: 'Post-Harvest Handling & Processing', code: 'BHT-22', creditsOrHours: '40 Hrs Theory / 60 Hrs Practical', description: 'Apple grading, CAS storage protocols, jam/jelly processing.' },
          { name: 'Agricultural Extension & Farmer Communication', code: 'BHT-23', creditsOrHours: '30 Hrs Theory / 50 Hrs Field Work', description: 'Field demonstration methods, farmer field school organization.' }
        ]
      }
    ],
    instructor: {
      name: 'Dr. Shabir Ahmad Dar',
      designation: 'Senior Training Officer (Horticulture)'
    },
    image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80',
    tags: ['Horticulture', 'Apple Orchards', 'Grafting', 'Post-Harvest', 'J&K Govt Diploma'],
    batchDates: 'Batch 2026-27 Starts: 1st September 2026'
  },
  {
    id: 'bat-102',
    code: 'BAT-102',
    title: 'Basic Agriculture Training Course',
    category: 'Long-Term Diploma',
    duration: '1 Year (2 Semesters)',
    eligibility: '10+2 Pass (Science / Agriculture) or Equivalent',
    seats: 40,
    stipendOrFee: 'Govt. Sponsored (Rs. 1,500/month Stipend to selected candidates)',
    description: 'The Basic Agriculture Training Course (BAT) provides thorough theoretical and practical education in crop agronomy, soil health science, seed multiplication, weed management, and farm machinery operations tailored for temperate and sub-tropical regions.',
    objectives: [
      'Understand paddy, maize, pulse, and oilseed cultivation practices in Kashmir valley.',
      'Hands-on experience in soil sampling, testing, micro-nutrient analysis, and fertilizer application.',
      'Operational knowledge of modern farm machinery including power tillers, seed drills, and sprayers.',
      'Training in organic farming protocols, vermicompost production, and bio-fertilizer usage.'
    ],
    modules: [
      {
        semesterOrTerm: 'Semester I: Agronomy & Soil Science',
        subjects: [
          { name: 'Principles of Crop Production & Agronomy', code: 'BAT-11', creditsOrHours: '60 Hrs Theory / 90 Hrs Field', description: 'Cereal, grain legume, and oilseed crop production techniques.' },
          { name: 'Soil Health Management & Testing', code: 'BAT-12', creditsOrHours: '45 Hrs Theory / 75 Hrs Lab', description: 'Soil physical properties, pH determination, NPK estimation.' },
          { name: 'Irrigation & Drainage Engineering', code: 'BAT-13', creditsOrHours: '40 Hrs Theory / 50 Hrs Field', description: 'Micro-irrigation, drip system design, rainwater harvesting.' }
        ]
      },
      {
        semesterOrTerm: 'Semester II: Plant Protection & Farm Management',
        subjects: [
          { name: 'Integrated Pest & Disease Management (IPM)', code: 'BAT-21', creditsOrHours: '50 Hrs Theory / 70 Hrs Practical', description: 'Biological control, biopesticides, chemical safety.' },
          { name: 'Farm Machinery & Power Operations', code: 'BAT-22', creditsOrHours: '30 Hrs Theory / 80 Hrs Field', description: 'Tractor attachments, sprayer calibration, maintenance.' },
          { name: 'Agricultural Economics & Marketing', code: 'BAT-23', creditsOrHours: '40 Hrs Theory / 40 Hrs Field Visits', description: 'Mandi pricing, e-NAM portal training, farmer producer organizations.' }
        ]
      }
    ],
    instructor: {
      name: 'Prof. Mohammad Altaf Wani',
      designation: 'Senior Training Officer (Agronomy)'
    },
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80',
    tags: ['Agriculture', 'Agronomy', 'Soil Testing', 'Farm Power', 'Seed Tech'],
    batchDates: 'Batch 2026-27 Starts: 1st September 2026'
  },
  {
    id: 'of-201',
    code: 'OF-201',
    title: 'Departmental Trainings',
    category: 'Short-Term Training',
    duration: '3 Months (Certificate)',
    eligibility: '10th Pass or Practicing Farmer / Rural Youth',
    seats: 30,
    stipendOrFee: 'Free (Under Paramparagat Krishi Vikas Yojana - PKVY)',
    description: 'An intensive skill certificate course focused on zero-budget natural farming, vermicompost unit setup, bio-input preparation (Jeevamrut, Neem oil sprays), and organic crop certification process.',
    objectives: [
      'Learn complete vermicompost bed construction and Eisenia fetida earthworm management.',
      'Prepare bio-pesticides and bio-fungicides using locally available natural ingredients.',
      'Understand organic certification standards (NPOP, PGS-India) for high-value Kashmiri produce.'
    ],
    modules: [
      {
        semesterOrTerm: 'Single Module: Production & Certification',
        subjects: [
          { name: 'Vermicompost Unit Management', code: 'OF-1', creditsOrHours: '20 Hrs Theory / 50 Hrs Practical', description: 'Bed preparation, moisture management, harvesting vermicompost.' },
          { name: 'Bio-Inputs & Natural Farming Practices', code: 'OF-2', creditsOrHours: '20 Hrs Theory / 40 Hrs Lab', description: 'Fermented liquid manures, bio-fertilizer inoculation.' }
        ]
      }
    ],
    instructor: {
      name: 'Dr. Farooq Ahmad Lone',
      designation: 'Subject Matter Specialist (Soil Science)'
    },
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80',
    tags: ['Organic Farming', 'Vermicompost', 'Bio-Fertilizer', 'Certification'],
    batchDates: 'Next Batch: 15th August 2026'
  },
  {
    id: 'gh-202',
    code: 'GH-202',
    title: 'Protected Cultivation & Hi-Tech Greenhouse Management',
    category: 'Short-Term Training',
    duration: '2 Months (Certificate)',
    eligibility: '10+2 Pass in Science / Agriculture preferred',
    seats: 25,
    stipendOrFee: 'Nominal Rs. 500 Registration Fee',
    description: 'Specialized course training candidates in polyhouse design, climate control systems, hydroponics basics, off-season vegetable production, and high-value flower cultivation.',
    objectives: [
      'Operate climate sensors, automated shading, and polyhouse ventilation systems.',
      'Cultivate capsicum, cucumber, cherry tomato, and cut flowers in controlled environment.',
      'Setup micro-drip fertigation units and water quality monitoring.'
    ],
    modules: [
      {
        semesterOrTerm: 'Module I: Greenhouse Operations & Crop Production',
        subjects: [
          { name: 'Polyhouse Structure & Climate Control', code: 'GH-1', creditsOrHours: '15 Hrs Theory / 35 Hrs Practical', description: 'Polycarbonate and polyhouse maintenance.' },
          { name: 'Off-Season Crop Production & Fertigation', code: 'GH-2', creditsOrHours: '20 Hrs Theory / 40 Hrs Field', description: 'High-tech vegetable cultivation & nutrient solution formulas.' }
        ]
      }
    ],
    instructor: {
      name: 'Er. Tariq Ahmad Rather',
      designation: 'Training Officer (Agri Engineering)'
    },
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
    tags: ['Protected Cultivation', 'Polyhouse', 'Hi-Tech Agri', 'Fertigation'],
    batchDates: 'Next Batch: 1st October 2026'
  },
  {
    id: 'mc-203',
    code: 'MC-203',
    title: 'Commercial Mushroom Cultivation & Spawn Production',
    category: 'Vocational Certificate',
    duration: '1 Month (Vocational Skill)',
    eligibility: 'Open to All (Min 8th Pass)',
    seats: 35,
    stipendOrFee: 'Free (Skill India Mission)',
    description: 'Practical training on Button Mushroom (Agaricus bisporus) compost preparation, Oyster mushroom cultivation, spawn laboratory techniques, and crop management during winter months.',
    objectives: [
      'Prepare synthetic compost formulations for button mushroom.',
      'Manage temperature, humidity, and casing soil for high yield.',
      'Learn post-harvest packaging and direct marketing to local markets.'
    ],
    modules: [
      {
        semesterOrTerm: 'Practical Skills Unit',
        subjects: [
          { name: 'Composting & Mushroom Casing', code: 'MC-1', creditsOrHours: '10 Hrs Theory / 30 Hrs Practical', description: 'Phase I & II composting method.' },
          { name: 'Spawn Lab & Harvest Management', code: 'MC-2', creditsOrHours: '10 Hrs Theory / 30 Hrs Lab', description: 'Grain spawn production and harvesting.' }
        ]
      }
    ],
    instructor: {
      name: 'Dr. Nusrat Jan',
      designation: 'Assistant Training Officer (Plant Pathology)'
    },
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    tags: ['Mushroom', 'Spawn Lab', 'Vocational Skill', 'Self-Employment'],
    batchDates: 'Next Batch: 5th September 2026'
  },
  {
    id: 'ip-204',
    code: 'IP-204',
    title: 'Integrated Pest & Nutrient Management (IPNM)',
    category: 'Short-Term Training',
    duration: '2 Months',
    eligibility: '10+2 Science / Diploma in Agri/Horti',
    seats: 30,
    stipendOrFee: 'Free (Govt. Capacity Building)',
    description: 'Comprehensive program on judicious chemical pesticide selection, bio-control agent rearing, leaf tissue analysis, and customized fertigation schedules for apple and vegetable crops.',
    objectives: [
      'Diagnose nutritional deficiencies in fruit crops from leaf symptoms.',
      'Calibrate mist blowers and spray equipment for uniform coverage.',
      'Implement biological parasite releases for orchard pest control.'
    ],
    modules: [
      {
        semesterOrTerm: 'Module I: Diagnostic & Field Application',
        subjects: [
          { name: 'Nutritional Diagnostics & Soil Testing', code: 'IP-1', creditsOrHours: '20 Hrs Theory / 30 Hrs Lab', description: 'Micro-nutrient deficiency correction.' },
          { name: 'Pest Surveillance & Bio-Control', code: 'IP-2', creditsOrHours: '20 Hrs Theory / 30 Hrs Field', description: 'Pheromone traps & parasitoid release.' }
        ]
      }
    ],
    instructor: {
      name: 'Dr. Shabir Ahmad Dar',
      designation: 'Senior Training Officer (Plant Protection)'
    },
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80',
    tags: ['IPM', 'Soil Health', 'Pesticide Safety', 'Plant Protection'],
    batchDates: 'Next Batch: 1st November 2026'
  }
];

export const FACULTY_LIST: FacultyMember[] = [
  {
    id: 'f-1',
    name: 'Dr. Javeed Ahmad Mugloo',
    designation: 'Prof. & Head',
    qualification: 'Ph.D. in Agro-Forestry (SKUAST-K)',
    department: 'Administration & Pomology',
    experience: '24+ Years in Extension & Research',
    email: 'principal.etcpulwama@jk.gov.in',
    image: '/prof-mugloo-final.jpg',
    specialization: 'Temperate Fruit Pomology & Extension Architecture'
  },
  {
    id: 'f-2',
    name: 'Dr. Shabir Ahmad Dar',
    designation: 'Senior Training Officer (Horticulture)',
    qualification: 'Ph.D. in Fruit Science',
    department: 'Horticulture & Canopy Management',
    experience: '18 Years',
    email: 'shabir.dar@etcpulwama.edu',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    specialization: 'High Density Apple Orchards & Grafting'
  },
  {
    id: 'f-3',
    name: 'Prof. Mohammad Altaf Wani',
    designation: 'Senior Training Officer (Agronomy)',
    qualification: 'M.Sc. Agriculture (Agronomy)',
    department: 'Agronomy & Soil Management',
    experience: '20 Years',
    email: 'altaf.wani@etcpulwama.edu',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    specialization: 'Crop Production, Seed Tech & Weed Science'
  },
  {
    id: 'f-4',
    name: 'Dr. Farooq Ahmad Lone',
    designation: 'Subject Matter Specialist (Soil Science)',
    qualification: 'Ph.D. Soil Science & Agri Chemistry',
    department: 'Soil & Water Testing Lab',
    experience: '15 Years',
    email: 'farooq.lone@etcpulwama.edu',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    specialization: 'Soil Micronutrient Testing & Fertigation'
  },
  {
    id: 'f-5',
    name: 'Er. Tariq Ahmad Rather',
    designation: 'Training Officer (Agri Engineering)',
    qualification: 'M.Tech Farm Power & Machinery',
    department: 'Agricultural Engineering',
    experience: '14 Years',
    email: 'tariq.rather@etcpulwama.edu',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    specialization: 'Polyhouse Engineering & Drip Irrigation'
  },
  {
    id: 'f-6',
    name: 'Dr. Nusrat Jan',
    designation: 'Assistant Training Officer (Pathology)',
    qualification: 'Ph.D. Plant Pathology',
    department: 'Plant Protection',
    experience: '11 Years',
    email: 'nusrat.jan@etcpulwama.edu',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    specialization: 'Fungal Pathogens & Mushroom Spawn Culture'
  }
];

export const DOWNLOADS_LIST: DownloadItem[] = [
  {
    id: 'd-1',
    title: 'Basic Horticulture Training Course (BHT) Admission Form 2026-27',
    category: 'Admission Forms',
    fileType: 'PDF',
    fileSize: '1.4 MB',
    uploadDate: '26 July 2026',
    downloadsCount: 1420,
    description: 'Official candidate application form for 1-Year BHT Diploma admissions. Complete with medical certificate format and affidavit format.',
    contentPreview: 'EXTENSION TRAINING CENTRE PULWAMA\nDEPARTMENT OF AGRICULTURE & FARMERS WELFARE J&K\n\nAPPLICATION FORM FOR ADMISSION TO BASIC HORTICULTURE TRAINING COURSE (BHT) BATCH 2026-27\n\n1. Full Name of Candidate (in Block Letters): ____________________\n2. Father/Guardian Name: ____________________\n3. Date of Birth: __/__/____  Age: __ Years\n4. Educational Qualification (Attach 10+2 Certificate Copy): ____________________\n5. District & Category (OM/ST/SC/ALC/RBA/EWS): ____________________\n6. Aadhaar Number: ______________ Mobile: ______________\n\nDeclaration: I hereby declare that all statements made in this application are true, complete, and correct to the best of my knowledge.'
  },
  {
    id: 'd-2',
    title: 'Basic Agriculture Training Course (BAT) Admission Form 2026-27',
    category: 'Admission Forms',
    fileType: 'PDF',
    fileSize: '1.2 MB',
    uploadDate: '26 July 2026',
    downloadsCount: 1150,
    description: 'Application form for 1-Year BAT Diploma admissions at ETC Pulwama with required document checklists.',
    contentPreview: 'EXTENSION TRAINING CENTRE PULWAMA\nAPPLICATION FORM FOR BASIC AGRICULTURE TRAINING COURSE (BAT)\n\nApplicant Name: ___________________________\nCourse Code: BAT-102\nAcademic Session: 2026-2027\n\nAttachments Required:\n1. 10th & 10+2 Marks Certificates\n2. Domicile Certificate of J&K UT\n3. Passport Size Photographs (4 Nos)\n4. Character Certificate from last attended institution.'
  },
  {
    id: 'd-3',
    title: 'Complete Syllabus & Curriculum - Basic Horticulture Training (BHT)',
    category: 'Syllabus & Curricula',
    fileType: 'PDF',
    fileSize: '3.8 MB',
    uploadDate: '15 May 2026',
    downloadsCount: 2890,
    description: 'Detailed semester-wise syllabus, practical exercise manual, field trip guidelines, and marks weightage distribution for BHT.',
    contentPreview: 'SYLLABUS FOR 1-YEAR BASIC HORTICULTURE TRAINING COURSE (BHT)\nETC PULWAMA - J&K GOVT\n\nSEMESTER I:\nUnit 1: Fundamentals of Pomology & Orchard Planning\nUnit 2: Grafting, Budding & Nursery Production Techniques\nUnit 3: Soil Fertility, Sampling & Fertigation in Temperate Fruits\nUnit 4: Major Insect Pests & Diseases of Apple, Cherry & Pear\n\nSEMESTER II:\nUnit 1: Commercial Vegetable Production & Polyhouse Technology\nUnit 2: Post-Harvest Operations, Cold Storage & Value Addition\nUnit 3: Extension Methodologies, Farmer Field Schools & ICT in Agriculture'
  },
  {
    id: 'd-4',
    title: 'Complete Syllabus & Curriculum - Basic Agriculture Training (BAT)',
    category: 'Syllabus & Curricula',
    fileType: 'PDF',
    fileSize: '3.5 MB',
    uploadDate: '15 May 2026',
    downloadsCount: 2310,
    description: 'Comprehensive 1-year syllabus breakdown for Agronomy, Seed Production, Soil Health, and Farm Engineering.',
    contentPreview: 'SYLLABUS FOR 1-YEAR BASIC AGRICULTURE TRAINING COURSE (BAT)\nETC PULWAMA - J&K GOVT\n\nSEMESTER I:\n- Agronomy of Cereals, Pulses & Oilseeds in Kashmir Region\n- Soil Physical & Chemical Properties, Soil Testing Procedures\n- Water Management & Drip/Sprinkler Irrigation Design\n\nSEMESTER II:\n- Integrated Pest Management (IPM) & Biological Control\n- Farm Machinery Maintenance & Field Operations\n- Agricultural Marketing, Co-operatives & FPO Formation'
  },
  {
    id: 'd-5',
    title: 'Academic Calendar & Semester Examination Date Sheet 2026',
    category: 'Exam Date Sheets',
    fileType: 'PDF',
    fileSize: '650 KB',
    uploadDate: '20 July 2026',
    downloadsCount: 1840,
    description: 'Official schedule for BHT & BAT Semester II final examinations and field practical evaluation.',
    contentPreview: 'EXTENSION TRAINING CENTRE PULWAMA\nDATE SHEET FOR SEMESTER II FINAL EXAMINATIONS (SESSION 2025-26)\n\nExam Timing: 10:30 AM to 01:30 PM\nVenue: Examination Hall - Block A\n\n18/08/2026 - BHT-21: Commercial Vegetable Science & Greenhouse Tech\n20/08/2026 - BAT-21: Integrated Pest & Disease Management\n22/08/2026 - BHT-22: Post-Harvest Handling & Processing\n24/08/2026 - BAT-22: Farm Machinery & Power Operations\n27/08/2026 - BHT-23 / BAT-23: Agricultural Extension & Farmer Communication\n\nNote: Field Practicals will commence from 01/09/2026.'
  },
  {
    id: 'd-6',
    title: 'Hostel Accommodation Request & Rules Form',
    category: 'Admission Forms',
    fileType: 'PDF',
    fileSize: '820 KB',
    uploadDate: '10 June 2026',
    downloadsCount: 780,
    description: 'Application form for securing hostel accommodation at ETC Pulwama Boys & Girls Hostel blocks.',
    contentPreview: 'ETC PULWAMA - HOSTEL ACCOMMODATION FORM\n\nName of Trainee: _____________________________\nEnrolled Course: [ ] BHT  [ ] BAT\nRoll Number: _________________\nHome Address & District: _______________________\nEmergency Contact Person & Number: _______________________\n\nRules & Undertaking:\n- Attendance after 7:00 PM in hostel rooms is compulsory.\n- Maintenance of hostel cleanliness and peaceful environment.'
  },
  {
    id: 'd-7',
    title: 'Handbook of Apple Diseases & Integrated Control Measures in Kashmir',
    category: 'Study Material',
    fileType: 'PDF',
    fileSize: '4.9 MB',
    uploadDate: '05 April 2026',
    downloadsCount: 4120,
    description: 'Illustrated digital reference guide prepared by ETC faculty for identifying and treating orchard diseases.',
    contentPreview: 'EXTENSION TRAINING CENTRE PULWAMA - TECHNICAL PUBLICATION\nHANDBOOK OF APPLE DISEASES & MANAGEMENT IN KASHMIR\n\nAuthors: Dr. Shabir Ahmad Dar & Dr. Nusrat Jan\n\nChapter 1: Apple Scab (Venturia inaequalis) - Lifecycle & Spray Schedules\nChapter 2: Alternaria Leaf Blotch & Powdering Mildew Management\nChapter 3: European Red Mites & San Jose Scale Control Protocols\nChapter 4: Post-Harvest Storage Rots & Fungicidal Safe Use'
  },
  {
    id: 'd-8',
    title: 'Trainee Stipend & Character Certificate Request Format',
    category: 'Certificates & Requests',
    fileType: 'PDF',
    fileSize: '450 KB',
    uploadDate: '12 January 2026',
    downloadsCount: 930,
    description: 'Requisition form for issuing monthly stipend clearance and official course completion/character certificates.',
    contentPreview: 'OFFICE OF THE PRINCIPAL, EXTENSION TRAINING CENTRE PULWAMA\nREQUISITION FOR STIPEND CLEARANCE & CERTIFICATE ISSUANCE\n\nStudent Name: ______________________________\nRoll No: __________________ Course: __________ Batch: _____\nLibrary Clearance: [ ] Verified  Hostel Clearance: [ ] Verified\nField Training Completion: [ ] Verified\n\nSignature of Course Director: ___________________'
  },
  {
    id: 'd-cert-bht',
    title: 'Download Certificate - Basic Horticulture Training Course (BHT)',
    category: 'Certificates & Requests',
    fileType: 'PDF',
    fileSize: '1.8 MB',
    uploadDate: '01 August 2026',
    downloadsCount: 3450,
    description: 'Official 1-Year BHT Course Completion Certificate issued by SKUAST-K Directorate of Extension / ETC Pulwama including Candidate Name, Parentage, Residence, District, Session, Division, Date, and Official Signatures.',
    contentPreview: 'SHER-E-KASHMIR UNIVERSITY OF AGRICULTURAL SCIENCES & TECHNOLOGY OF KASHMIR\nDirectorate of Extension\nExtension Training Centre / Krishi Vigyan Kendra, Pulwama\n\nCERTIFICATE\n\nThis is to certify that Shri/Smt. [CANDIDATE NAME] Son/Daughter of [PARENTAGE] R/o. [ADDRESS/RESIDENCE] District [DISTRICT] has been declared successful in One Year Basic Horticulture Training Course, Session [SESSION] in [DIVISION] Division.\n\nDate of issue: [DATE]\nSignatures: Checked by (I/c Academics) | Secretary (Board of Examination) | Chairman (Director Extension)'
  },
  {
    id: 'd-cert-bat',
    title: 'Download Certificate - Basic Agriculture Training Course (BAT)',
    category: 'Certificates & Requests',
    fileType: 'PDF',
    fileSize: '1.8 MB',
    uploadDate: '01 August 2026',
    downloadsCount: 2980,
    description: 'Official 1-Year BAT Course Completion Certificate issued by SKUAST-K Directorate of Extension / ETC Pulwama including Candidate Name, Parentage, Residence, District, Session, Division, Date, and Official Signatures.',
    contentPreview: 'SHER-E-KASHMIR UNIVERSITY OF AGRICULTURAL SCIENCES & TECHNOLOGY OF KASHMIR\nDirectorate of Extension\nExtension Training Centre / Krishi Vigyan Kendra, Pulwama\n\nCERTIFICATE\n\nThis is to certify that Shri/Smt. [CANDIDATE NAME] Son/Daughter of [PARENTAGE] R/o. [ADDRESS/RESIDENCE] District [DISTRICT] has been declared successful in One Year Basic Agriculture Training Course, Session [SESSION] in [DIVISION] Division.\n\nDate of issue: [DATE]\nSignatures: Checked by (I/c Academics) | Secretary (Board of Examination) | Chairman (Director Extension)'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Hands-on Apple Grafting & Bench Grafting Practical',
    category: 'Practical Sessions',
    imageUrl: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80',
    date: '14 June 2026',
    location: 'ETC High-Tech Nursery Farm, Pulwama',
    description: 'BHT Diploma trainees performing whip-and-tongue grafting on M9 dwarf rootstocks under expert supervision.'
  },
  {
    id: 'g-2',
    title: 'Soil Testing & NPK Chemical Analysis Laboratory',
    category: 'Labs & Research',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    date: '02 July 2026',
    location: 'Soil & Water Testing Laboratory',
    description: 'BAT trainees analyzing agricultural soil samples collected from district Pulwama farms for pH and nutrient mapping.'
  },
  {
    id: 'g-3',
    title: 'Exposure Field Visit to High-Density Apple Orchard in Shopian',
    category: 'Field Visits',
    imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=800&q=80',
    date: '18 May 2026',
    location: 'Shopian Demonstration Orchard',
    description: 'Students observing trellis drip irrigation and canopy pruning in commercial high-density Gala and Fuji apple plantations.'
  },
  {
    id: 'g-4',
    title: 'Hi-Tech Greenhouse Polyhouse Off-Season Tomato Harvest',
    category: 'Campus & Orchard',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
    date: '22 April 2026',
    location: 'Polyhouse Unit Block 2',
    description: 'Trainees harvesting organic cherry tomatoes cultivated under automated micro-climate polyhouses.'
  },
  {
    id: 'g-5',
    title: 'Annual Convocation & Diploma Distribution Ceremony 2025',
    category: 'Events & Ceremonies',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    date: '10 March 2026',
    location: 'Main Auditorium, ETC Pulwama',
    description: 'Joint Director Agriculture presenting BHT and BAT diploma certificates to outgoing batch of 2024-25.'
  },
  {
    id: 'g-6',
    title: 'Vermicompost Bed Preparation & Earthworm Inoculation',
    category: 'Practical Sessions',
    imageUrl: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80',
    date: '05 July 2026',
    location: 'Organic Farming Demonstration Unit',
    description: 'Short-term organic farming students building shaded vermicompost beds using bio-waste and Eisenia fetida.'
  },
  {
    id: 'g-7',
    title: 'Power Tiller & Farm Machinery Operation Training',
    category: 'Practical Sessions',
    imageUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80',
    date: '12 June 2026',
    location: 'Demonstration Fields, ETC Pulwama',
    description: 'BAT trainees gaining operational experience on multi-purpose power tillers and seed drills.'
  },
  {
    id: 'g-8',
    title: 'Mushroom Spawn Inoculation & Sterilization Unit',
    category: 'Labs & Research',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    date: '28 June 2026',
    location: 'Mushroom Technology Lab',
    description: 'Vocational trainees preparing wheat grain spawn under laminar flow hood for button mushroom cultivation.'
  }
];

export const DEMO_STUDENTS: StudentProfile[] = [];
export const DEMO_MARKS: Record<string, StudentMark[]> = {
  'ETC/2025/BHT-042': [
    { subjectCode: 'BHT-11', subjectName: 'Principles of Temperate Fruit Production', maxMarks: 100, obtainedMarks: 88, grade: 'A+', status: 'Pass' },
    { subjectCode: 'BHT-12', subjectName: 'Plant Nursery & Canopy Management', maxMarks: 100, obtainedMarks: 91, grade: 'O', status: 'Pass' },
    { subjectCode: 'BHT-13', subjectName: 'Horticultural Entomology & Pathology', maxMarks: 100, obtainedMarks: 82, grade: 'A', status: 'Pass' },
    { subjectCode: 'BHT-21', subjectName: 'Commercial Vegetable Science & Greenhouse Tech', maxMarks: 100, obtainedMarks: 86, grade: 'A+', status: 'Pass' },
    { subjectCode: 'BHT-22', subjectName: 'Post-Harvest Handling & Processing', maxMarks: 100, obtainedMarks: 90, grade: 'O', status: 'Pass' }
  ],
  'ETC/2025/BAT-018': [
    { subjectCode: 'BAT-11', subjectName: 'Principles of Crop Production & Agronomy', maxMarks: 100, obtainedMarks: 84, grade: 'A+', status: 'Pass' },
    { subjectCode: 'BAT-12', subjectName: 'Soil Health Management & Testing', maxMarks: 100, obtainedMarks: 89, grade: 'A+', status: 'Pass' },
    { subjectCode: 'BAT-13', subjectName: 'Irrigation & Drainage Engineering', maxMarks: 100, obtainedMarks: 79, grade: 'B+', status: 'Pass' },
    { subjectCode: 'BAT-21', subjectName: 'Integrated Pest & Disease Management', maxMarks: 100, obtainedMarks: 85, grade: 'A+', status: 'Pass' }
  ]
};

export const DEMO_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    title: 'Apple Scab Lifecycle & Fungicidal Spray Schedule Report',
    subject: 'Horticultural Pathology (BHT-13)',
    dueDate: '10 August 2026',
    status: 'Pending',
    downloadUrl: '#'
  },
  {
    id: 'asg-2',
    title: 'High-Density Nursery Rootstock Grafting Success Percentage Log',
    subject: 'Plant Nursery Management (BHT-12)',
    dueDate: '25 July 2026',
    status: 'Graded',
    marksObtained: '19 / 20'
  },
  {
    id: 'asg-3',
    title: 'Soil Micronutrient Sample Analysis & Recommended NPK Dose Chart',
    subject: 'Soil Health (BAT-12)',
    dueDate: '18 July 2026',
    status: 'Submitted'
  }
];

export const DEMO_TIMETABLE: TimetableEntry[] = [
  { day: 'Monday', time: '09:30 AM - 11:00 AM', subject: 'Temperate Pomology', type: 'Theory Lecture', venue: 'Hall 1', faculty: 'Dr. Shabir Ahmad Dar' },
  { day: 'Monday', time: '11:15 AM - 01:15 PM', subject: 'Apple Nursery Grafting', type: 'Field Practical', venue: 'Orchard Plot B', faculty: 'Dr. Shabir Ahmad Dar' },
  { day: 'Tuesday', time: '09:30 AM - 11:30 AM', subject: 'Soil NPK Chemical Analysis', type: 'Lab Session', venue: 'Soil Lab', faculty: 'Dr. Farooq A. Lone' },
  { day: 'Wednesday', time: '10:00 AM - 01:00 PM', subject: 'Greenhouse Climate & Fertigation', type: 'Field Practical', venue: 'Polyhouse 2', faculty: 'Er. Tariq A. Rather' },
  { day: 'Thursday', time: '09:30 AM - 11:00 AM', subject: 'Insect Pest Diagnostics', type: 'Lab Session', venue: 'Pathology Lab', faculty: 'Dr. Nusrat Jan' },
  { day: 'Friday', time: '10:00 AM - 12:30 PM', subject: 'Extension Field Visit & Farmer Interaction', type: 'Field Practical', venue: 'Koil Village Farm', faculty: 'Dr. G. H. Mir' }
];

export const FAQS = [
  {
    question: 'What is the duration and eligibility for the Basic Horticulture Training (BHT) course?',
    answer: 'BHT is a 1-Year (2 Semesters) diploma course. Candidates must have passed 10+2 with Science / Agriculture stream from a recognized board with minimum 50% marks. J&K Domicile is mandatory for government stipend seats.'
  },
  {
    question: 'Are students provided with a stipend during the course?',
    answer: 'Yes! Selected trainees in the Basic Horticulture Training (BHT) and Basic Agriculture Training (BAT) diploma programs receive a monthly stipend of Rs. 1,500 under Jammu & Kashmir Government Agriculture Extension schemes.'
  },
  {
    question: 'Is hostel accommodation available at ETC Pulwama campus?',
    answer: 'Yes, ETC Pulwama has separate, secure residential hostel blocks for outstation trainees equipped with mess facilities, reading rooms, and sports amenities.'
  },
  {
    question: 'How can a candidate apply for admission?',
    answer: 'Candidates can download the official admission form from our Downloads section or register directly through our online Student Portal on this website during the active admission window (July - August).'
  },
  {
    question: 'What career opportunities exist after completing BHT or BAT courses?',
    answer: 'Graduates can work as Horticultural Technicians, Extension Workers, Farm Supervisors, Nursery Entrepreneurs, Commercial Greenhouse Operators, or pursue higher studies in Agricultural Universities.'
  }
];
