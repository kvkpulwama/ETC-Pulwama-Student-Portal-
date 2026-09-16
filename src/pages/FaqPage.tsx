import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  IdCard, 
  Download, 
  MessageSquare, 
  ArrowRight,
  Sparkles,
  Mail,
  PhoneCall,
  ExternalLink
} from 'lucide-react';

interface FAQItem {
  id: string;
  category: 'registration' | 'idcard' | 'downloads' | 'general';
  question: string;
  answer: React.ReactNode;
}

export const FaqPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'registration' | 'idcard' | 'downloads' | 'general'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Help desk message form state
  const [contactForm, setContactForm] = useState({
    name: '',
    emailOrRoll: '',
    subject: 'ID Card Correction',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const categories = [
    { id: 'all', label: 'All Queries', icon: <HelpCircle className="w-3.5 h-3.5" /> },
    { id: 'registration', label: 'Trainee Registration', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'idcard', label: 'ID Card Issues', icon: <IdCard className="w-3.5 h-3.5" /> },
    { id: 'downloads', label: 'Downloads & Syllabi', icon: <Download className="w-3.5 h-3.5" /> },
    { id: 'general', label: 'General Information', icon: <MessageSquare className="w-3.5 h-3.5" /> }
  ];

  const faqs: FAQItem[] = [
    {
      id: 'reg-1',
      category: 'registration',
      question: 'How do I register on the ETC Student Portal for the first time?',
      answer: (
        <div className="space-y-2">
          <p>Trainees enrolled in the <strong>One Year Basic Horticulture Training (BHT)</strong> or <strong>Basic Agriculture Training (BAT)</strong> course can self-register using the following simple steps:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Click the yellow <strong>Student Login</strong> button in the top-right menu.</li>
            <li>Select the <strong>"Register / Create Account"</strong> tab at the bottom of the form.</li>
            <li>Fill in your formal name, roll number, email address, password, and upload a clean passport-sized photograph.</li>
            <li>Submit the form to instantly create your trainee profile.</li>
          </ol>
        </div>
      )
    },
    {
      id: 'reg-2',
      category: 'registration',
      question: 'Is online pre-registration open to the public for upcoming semesters?',
      answer: (
        <p>No, this portal is specifically for trainees who are already selected and officially enrolled by the <strong>Department of Agriculture Production & Farmers Welfare, J&K Government</strong>. External or public applications are managed separately through formal department advertisements.</p>
      )
    },
    {
      id: 'id-1',
      category: 'idcard',
      question: 'How do I generate and download my official SKUAST-K Student Identity Card?',
      answer: (
        <div className="space-y-2">
          <p>Your official Identity Card is generated automatically in real-time. Follow these steps to obtain it:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Navigate to the <strong>Student I-Card</strong> tab in the main navigation.</li>
            <li>Fill in your details (Roll Number, SKUAST-K Registration Number, Blood Group, Address, and Emergency Contact).</li>
            <li>Upload a high-quality, professional passport-sized photograph.</li>
            <li>Your live card preview (Front and Back side) will appear instantly. Click the <strong>Download Card</strong> button to get a high-quality printable PDF (ISO/IEC 7810 ID-1 standard CR80 size) for PVC lamination, or click <strong>Print Card</strong> to send it directly to your card printer.</li>
          </ol>
        </div>
      )
    },
    {
      id: 'id-2',
      category: 'idcard',
      question: 'What information does the security QR Code on my card encode?',
      answer: (
        <p>The secure QR Code generated on the back side of your ID card encodes critical verification data—your <strong>Full Name, Roll Number, Registration Number, Course, and Expiration Date</strong>. Administrative staff or library officers can scan this QR code on campus with any standard mobile camera or scanner for instant offline credential verification.</p>
      )
    },
    {
      id: 'id-3',
      category: 'idcard',
      question: 'My passport photo or name on the card has a typo. How do I fix it?',
      answer: (
        <p>You can instantly update any field by visiting the <strong>Student I-Card</strong> page, making your corrections inside the form, and clicking <strong>Save Details / Submit</strong>. The preview and downloadable files will update immediately in real-time. If you encounter errors, submit a request via the help form below, and our administration will assist you.</p>
      )
    },
    {
      id: 'id-4',
      category: 'idcard',
      question: 'What is the "Library Reader No." field, and is it mandatory?',
      answer: (
        <p>The <strong>Library Reader No.</strong> is a unique code assigned to trainees by the ETC Malangpora Library desk to track books and reading materials. This field is optional. If you haven&apos;t received your Library Reader Number yet, you can leave the field empty, and the card will render with a neat dash line.</p>
      )
    },
    {
      id: 'dl-1',
      category: 'downloads',
      question: 'Where can I find my course syllabus, assignment files, or academic calendar?',
      answer: (
        <p>All academic materials, circulars, syllabi, and administrative documents are updated regularly on our dedicated <strong>Downloads</strong> page. You can search, preview, and download them with a single click in PDF or DOCX formats.</p>
      )
    },
    {
      id: 'dl-2',
      category: 'downloads',
      question: 'I am getting a "Restricted Access" alert when downloading some documents. Why?',
      answer: (
        <p>Some formal notifications, previous year papers, or exam sheets are locked for registered students only. To unlock these files, please make sure you are logged in using your student account before accessing the <strong>Downloads</strong> section.</p>
      )
    },
    {
      id: 'gen-1',
      category: 'general',
      question: 'Are BHT and BAT courses residential programs?',
      answer: (
        <p>Yes, both the One Year Basic Horticulture Training (BHT) and Basic Agriculture Training (BAT) are highly structured, government-sponsored residential programs. Fully-equipped hostel facilities are provided on the Malangpora, Pulwama campus for selected trainees.</p>
      )
    },
    {
      id: 'gen-2',
      category: 'general',
      question: 'What is the standard stipend amount provided to trainees?',
      answer: (
        <p>Government-sponsored trainees officially selected by the Department of Agriculture Production, J&K, receive a monthly stipend of <strong>Rs. 1,500/-</strong> for the duration of the one-year training program, subject to regular academic attendance and satisfactory performance.</p>
      )
    }
  ];

  // Filter FAQs based on search query and selected category
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (typeof faq.answer === 'string' && (faq.answer as string).toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.emailOrRoll || !contactForm.message) {
      alert('Please fill out all required fields.');
      return;
    }
    setFormSubmitted(true);
    setContactForm({ name: '', emailOrRoll: '', subject: 'ID Card Correction', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-800 space-y-4">
        <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/60 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>PORTAL SUPPORT & ASSISTANCE</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Help & FAQ Support Desk
        </h1>

        <p className="text-sm sm:text-base text-emerald-100 max-w-3xl leading-relaxed">
          Find answers to common student queries regarding trainee registration, official SKUAST-K ID card generation, document downloads, and library reader registration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns (2/3): FAQ list and search */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Box */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search common queries, e.g., 'QR code', 'photo upload', 'library'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-slate-800 text-sm focus:outline-none placeholder-slate-400 font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded bg-slate-100"
              >
                Clear
              </button>
            )}
          </div>

          {/* Categories Tab Selector */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id as any);
                  setExpandedId(null);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  activeCategory === cat.id
                    ? 'bg-emerald-900 border-emerald-800 text-white shadow-md'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* FAQs Container */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            {filteredFaqs.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-2">
                <HelpCircle className="w-12 h-12 stroke-1 mx-auto text-slate-300 animate-pulse" />
                <h3 className="font-bold text-slate-800">No matching questions found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  We couldn&apos;t find any answers matching your search criteria. Try using different keywords or submit your query below.
                </p>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = expandedId === faq.id;
                return (
                  <div key={faq.id} className="transition-colors hover:bg-slate-50/40">
                    <button
                      onClick={() => toggleExpand(faq.id)}
                      className="w-full text-left px-5 py-4 sm:py-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900"
                    >
                      <span className="leading-snug">{faq.question}</span>
                      <span className={`p-1 rounded-lg shrink-0 ${isOpen ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-100 text-slate-500'}`}>
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    </button>
                    
                    {isOpen && (
                      <div className="px-5 pb-5 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100/50 pt-3 bg-slate-50/50 animate-fadeIn">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (1/3): Help Desk submission form */}
        <div className="space-y-6">
          {/* Quick Help Contacts Card */}
          <div className="bg-[#00482B] text-white rounded-2xl p-6 shadow-md border border-emerald-800 space-y-4">
            <h3 className="text-base font-black tracking-wide flex items-center gap-1.5 text-amber-300 uppercase">
              <Sparkles className="w-4 h-4" />
              ETC Help Desk Contacts
            </h3>
            
            <p className="text-xs text-emerald-100 leading-relaxed">
              If you have urgent queries regarding academic selection, verification, or portal access, please contact our helpline:
            </p>

            <div className="space-y-2.5 text-xs font-mono pt-2 border-t border-emerald-800/80">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-amber-400" />
                <span className="font-bold">+91 1933-293294</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span className="font-bold">pcpulwama@gmail.com</span>
              </div>
            </div>

            <div className="pt-2 text-[10px] text-emerald-200">
              Operating hours: <strong>10:00 AM to 4:00 PM</strong> (Monday to Saturday)
            </div>
          </div>

          {/* Live Query Submission Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">
              Submit a Correction Request
            </h3>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Facing issues with your I-Card or portal credentials? Send a request to our administrative desk.
            </p>

            {formSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center space-y-2 animate-fadeIn">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-extrabold text-xs text-emerald-950">Query Submitted Successfully!</h4>
                <p className="text-[10.5px] text-emerald-700 leading-snug">
                  Our portal coordinator will review your request shortly. Please allow up to 24 hours for a resolution.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="mt-2 text-[10px] font-bold text-emerald-800 hover:underline"
                >
                  Send another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-3">
                <div>
                  <label className="block text-slate-700 font-bold text-[11px] mb-1">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="e.g. Suhail Ahmad"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold text-[11px] mb-1">
                    Email or Roll Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.emailOrRoll}
                    onChange={(e) => setContactForm({ ...contactForm, emailOrRoll: e.target.value })}
                    placeholder="e.g. ETC/2026/BHT-05"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold text-[11px] mb-1">
                    Issue Subject
                  </label>
                  <select
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-800"
                  >
                    <option value="ID Card Correction">ID Card Correction / Photo Issue</option>
                    <option value="Trainee Registration Failure">Trainee Registration Failure</option>
                    <option value="Download Access Locked">Download Access Restricted</option>
                    <option value="Other Technical Glitch">Other Technical Glitch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold text-[11px] mb-1">
                    Detailed Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Please specify your request or describe your issue clearly..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 hover:scale-[1.01]"
                >
                  Submit Query
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple inline CheckCircle icon
const CheckCircle: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={2} 
    stroke="currentColor" 
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
