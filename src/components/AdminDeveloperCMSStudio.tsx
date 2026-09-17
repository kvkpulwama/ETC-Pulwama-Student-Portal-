import React, { useState } from 'react';
import { useSiteConfig, SiteConfig, DEFAULT_SITE_CONFIG } from '../lib/siteConfigStore';
import { NoticeItem, Course, FacultyMember } from '../types';
import { 
  Code, 
  Settings, 
  FileText, 
  Layout, 
  Bell, 
  BookOpen, 
  Users, 
  Sliders, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  Globe, 
  Image as ImageIcon, 
  ShieldCheck, 
  Terminal,
  HelpCircle,
  Eye,
  Zap
} from 'lucide-react';

export const AdminDeveloperCMSStudio: React.FC = () => {
  const { config, updateConfig, resetConfig } = useSiteConfig();
  const [activeTab, setActiveTab] = useState<'branding' | 'hero' | 'notices' | 'courses' | 'faculty' | 'developer' | 'rawjson'>('branding');
  const [draftConfig, setDraftConfig] = useState<SiteConfig>(config);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonText, setJsonText] = useState<string>(JSON.stringify(config, null, 2));

  // Sync draft when config changes from outside
  React.useEffect(() => {
    setDraftConfig(config);
    setJsonText(JSON.stringify(config, null, 2));
  }, [config]);

  const handlePublish = (customData?: SiteConfig) => {
    const dataToPublish = customData || draftConfig;
    const success = updateConfig(dataToPublish);
    if (success) {
      setSaveStatus('Site configuration published live successfully!');
      setTimeout(() => setSaveStatus(null), 4000);
    } else {
      setSaveStatus('Failed to save configuration.');
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all site text, images, and configuration back to factory default?')) {
      const def = resetConfig();
      setDraftConfig(def);
      setJsonText(JSON.stringify(def, null, 2));
      setSaveStatus('Site configuration restored to factory defaults!');
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  const handleJsonPublish = () => {
    try {
      setJsonError(null);
      const parsed = JSON.parse(jsonText);
      setDraftConfig(parsed);
      handlePublish(parsed);
    } catch (err: any) {
      setJsonError(`JSON Syntax Error: ${err.message}`);
    }
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(draftConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ETC_Pulwama_SiteConfig_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        setDraftConfig(parsed);
        setJsonText(JSON.stringify(parsed, null, 2));
        setSaveStatus('Backup loaded into editor! Click "Publish All Changes Live" to apply.');
      } catch (err: any) {
        alert(`Invalid JSON file format: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-100">
      {/* Studio Header Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 p-6 border-b border-emerald-900/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider font-mono">
            <Terminal className="w-4 h-4" />
            <span>Developer & CMS Web Master Studio</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1 flex items-center gap-2">
            <span>Full Site Control & Live Publisher</span>
            <span className="bg-amber-400/20 text-amber-300 text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-amber-400/30">
              Admin Privileges
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Edit all page texts, titles, hero banners, photos, program modules, notices, and developer CSS/script settings in real time.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => handlePublish()}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>Publish All Changes Live</span>
          </button>

          <button
            onClick={handleReset}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-red-200 font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
            title="Reset site text and images to factory defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Save Status Toast Notice */}
      {saveStatus && (
        <div className="bg-emerald-950 border-b border-emerald-800/80 px-6 py-3 text-xs font-bold text-emerald-200 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveStatus}</span>
          </div>
          <span className="text-[10px] font-mono bg-emerald-900 px-2 py-0.5 rounded text-emerald-300">Live Updated</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 px-4 pt-3 bg-slate-950 border-b border-slate-800 overflow-x-auto text-xs font-bold scrollbar-none">
        <button
          onClick={() => setActiveTab('branding')}
          className={`px-4 py-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'branding' 
              ? 'border-amber-400 text-amber-300 bg-slate-900/80 rounded-t-xl' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Branding & Institution</span>
        </button>

        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'hero' 
              ? 'border-amber-400 text-amber-300 bg-slate-900/80 rounded-t-xl' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>Hero Banner & Alert</span>
        </button>

        <button
          onClick={() => setActiveTab('notices')}
          className={`px-4 py-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'notices' 
              ? 'border-amber-400 text-amber-300 bg-slate-900/80 rounded-t-xl' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notices ({draftConfig.notices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'courses' 
              ? 'border-amber-400 text-amber-300 bg-slate-900/80 rounded-t-xl' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Diplomas & Courses ({draftConfig.courses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('faculty')}
          className={`px-4 py-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'faculty' 
              ? 'border-amber-400 text-amber-300 bg-slate-900/80 rounded-t-xl' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Faculty Roster ({draftConfig.faculty.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('developer')}
          className={`px-4 py-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'developer' 
              ? 'border-amber-400 text-amber-300 bg-slate-900/80 rounded-t-xl' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Feature Flags & Custom CSS</span>
        </button>

        <button
          onClick={() => setActiveTab('rawjson')}
          className={`px-4 py-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap font-mono ${
            activeTab === 'rawjson' 
              ? 'border-amber-400 text-amber-300 bg-slate-900/80 rounded-t-xl' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Raw JSON Code Studio</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-6">
        {/* TAB 1: BRANDING & INSTITUTION */}
        {activeTab === 'branding' && (
          <div className="space-y-6">
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>Institution General Details & Headings</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Institution Name</label>
                  <input
                    type="text"
                    value={draftConfig.institution.name}
                    onChange={(e) => setDraftConfig({
                      ...draftConfig,
                      institution: { ...draftConfig.institution, name: e.target.value }
                    })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Department / Sub-Heading</label>
                  <input
                    type="text"
                    value={draftConfig.institution.subHeading}
                    onChange={(e) => setDraftConfig({
                      ...draftConfig,
                      institution: { ...draftConfig.institution, subHeading: e.target.value }
                    })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Official Email Address</label>
                  <input
                    type="email"
                    value={draftConfig.institution.email}
                    onChange={(e) => setDraftConfig({
                      ...draftConfig,
                      institution: { ...draftConfig.institution, email: e.target.value }
                    })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Phone / Office Contact</label>
                  <input
                    type="text"
                    value={draftConfig.institution.phone}
                    onChange={(e) => setDraftConfig({
                      ...draftConfig,
                      institution: { ...draftConfig.institution, phone: e.target.value }
                    })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-400 font-bold mb-1">Full Campus Address</label>
                  <input
                    type="text"
                    value={draftConfig.institution.address}
                    onChange={(e) => setDraftConfig({
                      ...draftConfig,
                      institution: { ...draftConfig.institution, address: e.target.value }
                    })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-400 font-bold mb-1">Tagline & Vision Statement</label>
                  <textarea
                    rows={2}
                    value={draftConfig.institution.tagline}
                    onChange={(e) => setDraftConfig({
                      ...draftConfig,
                      institution: { ...draftConfig.institution, tagline: e.target.value }
                    })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Principal / Head Message */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Principal / Head of Institution Profile</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Principal / Head Name</label>
                  <input
                    type="text"
                    value={draftConfig.institution.principalName}
                    onChange={(e) => setDraftConfig({
                      ...draftConfig,
                      institution: { ...draftConfig.institution, principalName: e.target.value }
                    })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Designation</label>
                  <input
                    type="text"
                    value={draftConfig.institution.principalDesignation}
                    onChange={(e) => setDraftConfig({
                      ...draftConfig,
                      institution: { ...draftConfig.institution, principalDesignation: e.target.value }
                    })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-400 font-bold mb-1">Principal / Head Photograph</label>
                  <div className="flex items-center gap-3">
                    <img 
                      src={draftConfig.institution.principalPhoto} 
                      alt="Principal" 
                      className="w-12 h-12 rounded-full object-cover border-2 border-amber-400/50 shrink-0 bg-slate-800" 
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                    <input
                      type="text"
                      value={draftConfig.institution.principalPhoto}
                      onChange={(e) => setDraftConfig({
                        ...draftConfig,
                        institution: { ...draftConfig.institution, principalPhoto: e.target.value }
                      })}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                      placeholder="Enter photo URL or click Upload Photo button ->"
                    />
                    <label className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shrink-0 shadow">
                      <Upload className="w-4 h-4" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                setDraftConfig({
                                  ...draftConfig,
                                  institution: { ...draftConfig.institution, principalPhoto: event.target.result as string }
                                });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-400 font-bold mb-1">Welcome Message to Visitors & Students</label>
                  <textarea
                    rows={4}
                    value={draftConfig.institution.principalMessage}
                    onChange={(e) => setDraftConfig({
                      ...draftConfig,
                      institution: { ...draftConfig.institution, principalMessage: e.target.value }
                    })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HERO BANNER & EMERGENCY NOTICES */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <Layout className="w-4 h-4" />
                <span>Homepage Hero Banner Configuration</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Hero Top Badge Text</label>
                  <input
                    type="text"
                    value={draftConfig.hero.badgeText}
                    onChange={(e) => setDraftConfig({
                      ...draftConfig,
                      hero: { ...draftConfig.hero, badgeText: e.target.value }
                    })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Main Hero Headline</label>
                  <input
                    type="text"
                    value={draftConfig.hero.title}
                    onChange={(e) => setDraftConfig({
                      ...draftConfig,
                      hero: { ...draftConfig.hero, title: e.target.value }
                    })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Hero Sub-Title / Description Paragraph</label>
                  <textarea
                    rows={3}
                    value={draftConfig.hero.subTitle}
                    onChange={(e) => setDraftConfig({
                      ...draftConfig,
                      hero: { ...draftConfig.hero, subTitle: e.target.value }
                    })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Background Banner Image (URL or File Upload)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={draftConfig.hero.bannerImageUrl}
                      onChange={(e) => setDraftConfig({
                        ...draftConfig,
                        hero: { ...draftConfig.hero, bannerImageUrl: e.target.value }
                      })}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                      placeholder="Image URL or upload background image ->"
                    />
                    <label className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shrink-0 shadow">
                      <Upload className="w-4 h-4" />
                      <span>Upload Banner</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                setDraftConfig({
                                  ...draftConfig,
                                  hero: { ...draftConfig.hero, bannerImageUrl: event.target.result as string }
                                });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Top Banner */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span>Top Emergency Alert Bar</span>
                </h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draftConfig.hero.showEmergencyNotice}
                    onChange={(e) => setDraftConfig({
                      ...draftConfig,
                      hero: { ...draftConfig.hero, showEmergencyNotice: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
                  <span className="ml-3 text-xs font-bold text-slate-300">Show Alert Bar</span>
                </label>
              </div>

              {draftConfig.hero.showEmergencyNotice && (
                <div>
                  <label className="block text-slate-400 font-bold text-xs mb-1">Emergency Notice Message</label>
                  <textarea
                    rows={2}
                    value={draftConfig.hero.emergencyNoticeText}
                    onChange={(e) => setDraftConfig({
                      ...draftConfig,
                      hero: { ...draftConfig.hero, emergencyNoticeText: e.target.value }
                    })}
                    className="w-full bg-slate-900 border border-amber-500/50 rounded-xl px-3 py-2 text-amber-200 font-medium text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: NOTICES MANAGER */}
        {activeTab === 'notices' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider">
                Manage Official Campus Notices
              </h3>
              <button
                onClick={() => {
                  const newNotice: NoticeItem = {
                    id: `n-${Date.now()}`,
                    title: 'New Official Announcement',
                    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                    category: 'General',
                    isImportant: false
                  };
                  setDraftConfig({
                    ...draftConfig,
                    notices: [newNotice, ...draftConfig.notices]
                  });
                }}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Notice</span>
              </button>
            </div>

            <div className="space-y-3">
              {draftConfig.notices.map((notice, idx) => (
                <div key={notice.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                      Notice #{idx + 1}
                    </span>
                    <button
                      onClick={() => {
                        setDraftConfig({
                          ...draftConfig,
                          notices: draftConfig.notices.filter(n => n.id !== notice.id)
                        });
                      }}
                      className="text-red-400 hover:text-red-300 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="md:col-span-2">
                      <label className="block text-slate-400 font-bold mb-1">Notice Heading Title</label>
                      <input
                        type="text"
                        value={notice.title}
                        onChange={(e) => {
                          const updated = [...draftConfig.notices];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setDraftConfig({ ...draftConfig, notices: updated });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-medium focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Date</label>
                      <input
                        type="text"
                        value={notice.date}
                        onChange={(e) => {
                          const updated = [...draftConfig.notices];
                          updated[idx] = { ...updated[idx], date: e.target.value };
                          setDraftConfig({ ...draftConfig, notices: updated });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-medium focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Category</label>
                      <select
                        value={notice.category}
                        onChange={(e) => {
                          const updated = [...draftConfig.notices];
                          updated[idx] = { ...updated[idx], category: e.target.value };
                          setDraftConfig({ ...draftConfig, notices: updated });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-medium focus:border-amber-400 focus:outline-none"
                      >
                        <option value="Admissions">Admissions</option>
                        <option value="Exams">Exams</option>
                        <option value="Events">Events</option>
                        <option value="General">General</option>
                      </select>
                    </div>

                    <div className="flex items-center pt-5">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-300">
                        <input
                          type="checkbox"
                          checked={notice.isImportant}
                          onChange={(e) => {
                            const updated = [...draftConfig.notices];
                            updated[idx] = { ...updated[idx], isImportant: e.target.checked };
                            setDraftConfig({ ...draftConfig, notices: updated });
                          }}
                          className="w-4 h-4 rounded text-amber-400 bg-slate-900 border-slate-700 focus:ring-amber-400"
                        />
                        <span>Mark as High Priority / Important</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: COURSES & DIPLOMAS */}
        {activeTab === 'courses' && (
          <div className="space-y-4">
            <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider">
              Academic Courses & Vocational Programs
            </h3>

            <div className="space-y-4">
              {draftConfig.courses.map((course, idx) => (
                <div key={course.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-amber-300 font-bold">{course.code} - {course.title}</span>
                    <span className="bg-slate-800 px-2.5 py-0.5 rounded text-slate-300 text-[10px]">{course.category}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Course Title</label>
                      <input
                        type="text"
                        value={course.title}
                        onChange={(e) => {
                          const updated = [...draftConfig.courses];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setDraftConfig({ ...draftConfig, courses: updated });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Duration & Structure</label>
                      <input
                        type="text"
                        value={course.duration}
                        onChange={(e) => {
                          const updated = [...draftConfig.courses];
                          updated[idx] = { ...updated[idx], duration: e.target.value };
                          setDraftConfig({ ...draftConfig, courses: updated });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Stipend / Fee Details</label>
                      <input
                        type="text"
                        value={course.stipendOrFee}
                        onChange={(e) => {
                          const updated = [...draftConfig.courses];
                          updated[idx] = { ...updated[idx], stipendOrFee: e.target.value };
                          setDraftConfig({ ...draftConfig, courses: updated });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Sanctioned Seats</label>
                      <input
                        type="number"
                        value={course.seats}
                        onChange={(e) => {
                          const updated = [...draftConfig.courses];
                          updated[idx] = { ...updated[idx], seats: Number(e.target.value) };
                          setDraftConfig({ ...draftConfig, courses: updated });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-medium"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-slate-400 font-bold mb-1">Overview Description</label>
                      <textarea
                        rows={2}
                        value={course.description}
                        onChange={(e) => {
                          const updated = [...draftConfig.courses];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          setDraftConfig({ ...draftConfig, courses: updated });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-medium"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: FACULTY ROSTER */}
        {activeTab === 'faculty' && (
          <div className="space-y-4">
            {/* Guide Card */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-200 flex items-start gap-3 shadow-md">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-300">How to Change Faculty & Scientist Photographs:</h4>
                <p className="mt-1 leading-relaxed text-slate-200">
                  <strong>Option 1 (Upload File):</strong> Click the yellow <strong>"Upload Photo"</strong> button next to any faculty member to pick an image file (JPG/PNG) directly from your computer.
                  <br />
                  <strong>Option 2 (Paste Link):</strong> Paste any direct web link or asset path (e.g. <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">/dr_javeed_portrait.jpg</code>) into the <strong>Photo URL</strong> box.
                  <br />
                  <span className="text-amber-400 font-bold">Important:</span> After selecting or uploading your photos, click <strong className="text-white bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded">"Publish All Changes Live"</strong> at the top right to apply them across the entire portal!
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider">
                Faculty &amp; Scientist Roster Management
              </h3>
              <span className="text-xs text-slate-400 font-mono">Total Faculty: {draftConfig.faculty.length}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {draftConfig.faculty.map((f, idx) => (
                <div key={f.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs shadow-lg hover:border-amber-500/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <img 
                      src={f.image} 
                      alt={f.name} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-amber-400/50 shrink-0 bg-slate-900 shadow" 
                      onError={(e) => { (e.target as HTMLImageElement).src = '/blank-avatar.svg'; }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-white text-sm truncate">{f.name}</div>
                      <div className="text-[11px] text-amber-300 truncate">{f.designation}</div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1 border-t border-slate-800/80">
                    <div>
                      <label className="block text-slate-400 font-bold text-[10px] mb-0.5">Full Name</label>
                      <input
                        type="text"
                        value={f.name}
                        onChange={(e) => {
                          const updated = [...draftConfig.faculty];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          setDraftConfig({ ...draftConfig, faculty: updated });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-medium focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold text-[10px] mb-0.5">Designation &amp; Dept</label>
                      <input
                        type="text"
                        value={f.designation}
                        onChange={(e) => {
                          const updated = [...draftConfig.faculty];
                          updated[idx] = { ...updated[idx], designation: e.target.value };
                          setDraftConfig({ ...draftConfig, faculty: updated });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-medium focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold text-[10px] mb-0.5">Photo URL / File Upload</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={f.image}
                          onChange={(e) => {
                            const updated = [...draftConfig.faculty];
                            updated[idx] = { ...updated[idx], image: e.target.value };
                            setDraftConfig({ ...draftConfig, faculty: updated });
                          }}
                          placeholder="/dr_javeed_portrait.jpg or https://..."
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-[11px] focus:border-amber-400 focus:outline-none"
                        />
                        <label className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] rounded-lg cursor-pointer transition-all flex items-center gap-1.5 shrink-0 shadow">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  if (event.target?.result) {
                                    const updated = [...draftConfig.faculty];
                                    updated[idx] = { ...updated[idx], image: event.target.result as string };
                                    setDraftConfig({ ...draftConfig, faculty: updated });
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: DEVELOPER FEATURE FLAGS & CUSTOM CSS */}
        {activeTab === 'developer' && (
          <div className="space-y-6">
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                <span>Feature Flags & Portal Capabilities</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <label className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="font-bold text-white">Online Student Portal</div>
                    <div className="text-[10px] text-slate-400">Allow candidates to sign in, view marksheets, and generate digital ID cards</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={draftConfig.developer.enableStudentPortal}
                    onChange={(e) => setDraftConfig({
                      ...draftConfig,
                      developer: { ...draftConfig.developer, enableStudentPortal: e.target.checked }
                    })}
                    className="w-4 h-4 rounded text-amber-400 bg-slate-900 border-slate-700"
                  />
                </label>

                <label className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="font-bold text-white">Online Application Registrations</div>
                    <div className="text-[10px] text-slate-400">Enable public admission application submissions</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={draftConfig.developer.enableRegistration}
                    onChange={(e) => setDraftConfig({
                      ...draftConfig,
                      developer: { ...draftConfig.developer, enableRegistration: e.target.checked }
                    })}
                    className="w-4 h-4 rounded text-amber-400 bg-slate-900 border-slate-700"
                  />
                </label>

                <label className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="font-bold text-white">Certificate Verification Service</div>
                    <div className="text-[10px] text-slate-400">Public search for authenticating roll numbers & credentials</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={draftConfig.developer.enableVerificationService}
                    onChange={(e) => setDraftConfig({
                      ...draftConfig,
                      developer: { ...draftConfig.developer, enableVerificationService: e.target.checked }
                    })}
                    className="w-4 h-4 rounded text-amber-400 bg-slate-900 border-slate-700"
                  />
                </label>

                <label className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="font-bold text-white">Maintenance Mode Banner</div>
                    <div className="text-[10px] text-slate-400">Display website under scheduled maintenance warning</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={draftConfig.developer.maintenanceMode}
                    onChange={(e) => setDraftConfig({
                      ...draftConfig,
                      developer: { ...draftConfig.developer, maintenanceMode: e.target.checked }
                    })}
                    className="w-4 h-4 rounded text-amber-400 bg-slate-900 border-slate-700"
                  />
                </label>
              </div>
            </div>

            {/* Custom CSS Injector */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <Code className="w-4 h-4" />
                <span>Custom Developer CSS Snippet Injector</span>
              </h3>
              <p className="text-xs text-slate-400">
                CSS code entered here will be dynamically injected into all pages across the website.
              </p>

              <textarea
                rows={6}
                value={draftConfig.developer.customCss}
                onChange={(e) => setDraftConfig({
                  ...draftConfig,
                  developer: { ...draftConfig.developer, customCss: e.target.value }
                })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-300 focus:border-amber-400 focus:outline-none"
                placeholder="/* Add custom CSS rules here */"
              />
            </div>
          </div>
        )}

        {/* TAB 7: RAW JSON CODE STUDIO */}
        {activeTab === 'rawjson' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-2 font-mono">
                  <Terminal className="w-4 h-4" />
                  <span>Developer Raw JSON Configuration Schema</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Full developer control: edit the site schema directly or export/import site backups.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportJson}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON Backup</span>
                </button>

                <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 border border-slate-700 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import JSON Backup</span>
                  <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
                </label>
              </div>
            </div>

            {jsonError && (
              <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs font-bold text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{jsonError}</span>
              </div>
            )}

            <textarea
              rows={18}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-amber-300 focus:border-amber-400 focus:outline-none"
            />

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  try {
                    const formatted = JSON.stringify(JSON.parse(jsonText), null, 2);
                    setJsonText(formatted);
                    setJsonError(null);
                  } catch (err: any) {
                    setJsonError(`Cannot format: ${err.message}`);
                  }
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
              >
                Format & Validate JSON
              </button>

              <button
                onClick={handleJsonPublish}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Publish Raw JSON Live</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
