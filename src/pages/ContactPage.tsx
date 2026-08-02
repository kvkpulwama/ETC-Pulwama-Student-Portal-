import React, { useState } from 'react';
import { INSTITUTION_INFO, FAQS } from '../data/mockData';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Send, 
  CheckCircle2, 
  HelpCircle, 
  Clock, 
  Building2, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Globe
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Admission Query (BHT / BAT)');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedQuery, setSubmittedQuery] = useState<{ trackingCode: string; name: string } | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const code = `ETC-TKN-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      setSubmittedQuery({ trackingCode: code, name });
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-800 space-y-4">
        <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/60 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
          <Phone className="w-3.5 h-3.5" />
          <span>OFFICIAL HELPLINE & CAMPUS DIRECTORY</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Contact Extension Training Centre Pulwama
        </h1>

        <p className="text-sm sm:text-base text-emerald-100 max-w-3xl leading-relaxed">
          Have questions regarding <strong>Basic Horticulture Training (BHT)</strong> or <strong>Basic Agriculture Training (BAT)</strong> admissions? Reach out to our training office or send an online inquiry.
        </p>
      </div>

      {/* Main Grid: Form + Address Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Send className="w-5 h-5 text-emerald-700" />
              <span>Submit Online Public Inquiry</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Your message will be assigned a unique ticket tracking ID for prompt official response.
            </p>
          </div>

          {submittedQuery ? (
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-3 animate-in fade-in duration-300">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Inquiry Logged Successfully!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Thank you, <strong>{submittedQuery.name}</strong>. Your query has been logged with the ETC Pulwama Public Relations Cell.
              </p>

              <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs font-mono font-bold text-emerald-900 max-w-sm mx-auto">
                Tracking Ticket: {submittedQuery.trackingCode}
              </div>

              <button
                onClick={() => setSubmittedQuery(null)}
                className="px-4 py-2 bg-emerald-800 text-white font-bold text-xs rounded-xl hover:bg-emerald-900"
              >
                Send Another Query
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9797XXXXXX"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Inquiry Category
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="Admission Query (BHT / BAT)">Admission Query (BHT / BAT)</option>
                    <option value="Hostel & Stipend Info">Hostel & Stipend Info</option>
                    <option value="Short-Term Organic Skill Training">Short-Term Organic Skill Training</option>
                    <option value="Soil Testing Request">Soil Testing Request</option>
                    <option value="Other Official Query">Other Official Query</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message / Inquiry Details *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your query regarding courses, dates, or eligibility..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>{isSubmitting ? 'Logging Inquiry Ticket...' : 'Submit Inquiry Form'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Address & Office Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white p-6 rounded-2xl border border-slate-800 space-y-4 shadow-sm">
            <h3 className="font-extrabold text-base border-b border-slate-800 pb-2 text-amber-300">
              Campus Office Address
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Extension Training Centre (ETC) Pulwama</p>
                  <p>{INSTITUTION_INFO.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold text-white">Telephone & Helpline</p>
                  <p>{INSTITUTION_INFO.phone} • Helpline: {INSTITUTION_INFO.helpline}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold text-white">Official Web Portal Domain</p>
                  <p className="text-amber-300 font-mono font-bold">https://etcpulwama.edu</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold text-white">Official Emails</p>
                  <p>{INSTITUTION_INFO.email}</p>
                  <p>{INSTITUTION_INFO.altEmail}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <p className="font-bold text-white">Visiting Office Hours</p>
                  <p>Monday – Saturday: 10:00 AM – 04:30 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Map Visualizer */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
            <h4 className="font-bold text-xs uppercase text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>Pulwama Location Map</span>
            </h4>

            <div className="h-44 bg-slate-100 rounded-xl border border-slate-200 relative overflow-hidden flex items-center justify-center text-center p-4">
              <div className="absolute inset-0 bg-emerald-950/10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="relative z-10 bg-white/95 p-3 rounded-xl shadow-md border border-slate-200 space-y-1">
                <p className="font-extrabold text-xs text-slate-900">ETC Pulwama Campus</p>
                <p className="text-[10px] text-slate-500">Koil Road, Near District Complex, Pulwama</p>
                <span className="inline-block px-2 py-0.5 bg-emerald-800 text-white text-[10px] font-bold rounded">
                  GPS: 33.8718° N, 74.8986° E
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6 shadow-sm">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
            Common Inquiries
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-emerald-700" />
            <span>Frequently Asked Questions (FAQs)</span>
          </h2>
        </div>

        <div className="divide-y divide-slate-200">
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="py-4">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full text-left font-bold text-sm text-slate-900 flex items-center justify-between gap-4 hover:text-emerald-800 transition-colors"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-800 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
