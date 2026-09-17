import { useState, useEffect } from 'react';
import { INSTITUTION_INFO, NOTICES, COURSES, FACULTY_LIST, DOWNLOADS_LIST } from '../data/mockData';
import { NoticeItem, Course, FacultyMember, DownloadItem } from '../types';

export interface SiteConfig {
  institution: {
    name: string;
    subHeading: string;
    tagline: string;
    address: string;
    phone: string;
    helpline: string;
    email: string;
    altEmail: string;
    domain: string;
    website: string;
    established: string;
    campusArea: string;
    principalName: string;
    principalDesignation: string;
    principalPhoto: string;
    principalMessage: string;
  };
  hero: {
    badgeText: string;
    title: string;
    subTitle: string;
    primaryBtnText: string;
    secondaryBtnText: string;
    bannerImageUrl: string;
    showEmergencyNotice: boolean;
    emergencyNoticeText: string;
  };
  notices: NoticeItem[];
  courses: Course[];
  faculty: FacultyMember[];
  downloads: DownloadItem[];
  faqs: Array<{ id: string; question: string; answer: string; category: string }>;
  developer: {
    customCss: string;
    customFooterText: string;
    enableRegistration: boolean;
    enableStudentPortal: boolean;
    enableVerificationService: boolean;
    maintenanceMode: boolean;
    primaryThemeColor: string;
  };
}

const STORAGE_KEY = 'etc_site_config_v4';
const EVENT_NAME = 'etc_site_config_updated';

export const DEFAULT_FAQS = [
  {
    id: 'faq-1',
    question: 'What courses are offered at Extension Training Centre (ETC) Pulwama?',
    answer: 'ETC Pulwama offers 1-Year Government Diplomas in Basic Horticulture Training (BHT) and Basic Agriculture Training (BAT), alongside short-term certifications in Organic Farming, Protected Cultivation (Polyhouse), Commercial Mushroom Production, and IPNM.',
    category: 'Admissions'
  },
  {
    id: 'faq-2',
    question: 'Is there any monthly stipend or government scholarship available?',
    answer: 'Yes! Selected candidates enrolled in the 1-Year BHT and BAT diploma courses receive a monthly government stipend of Rs. 1,500/month as per Department of Agriculture Production & Farmers Welfare J&K rules.',
    category: 'Stipend & Fees'
  },
  {
    id: 'faq-3',
    question: 'What is the eligibility criteria for 1-Year Diploma Courses?',
    answer: 'Candidates must have passed 10+2 (Higher Secondary Part-II) with Science or Agriculture stream from a recognized board with minimum 50% aggregate marks.',
    category: 'Eligibility'
  },
  {
    id: 'faq-4',
    question: 'How can I verify a student registration or certificate online?',
    answer: 'You can verify student profiles and authentic certificates instantly by navigating to the "Online Certificate Verification" section on this portal or searching by Roll Number.',
    category: 'Verification'
  }
];

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  institution: { ...INSTITUTION_INFO },
  hero: {
    badgeText: '',
    title: 'Transforming Agriculture & Horticulture through Technical Excellence',
    subTitle: '',
    primaryBtnText: 'Explore Diploma Courses',
    secondaryBtnText: 'Student Portal & ID Card',
    bannerImageUrl: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=1200&q=80',
    showEmergencyNotice: false,
    emergencyNoticeText: ''
  },
  notices: [...NOTICES],
  courses: [...COURSES],
  faculty: [...FACULTY_LIST],
  downloads: [...DOWNLOADS_LIST],
  faqs: [...DEFAULT_FAQS],
  developer: {
    customCss: '/* Custom CSS rules injected by Admin Developer Console */\n.bg-accent-glow { box-shadow: 0 0 25px rgba(251, 191, 36, 0.25); }',
    customFooterText: 'Official Portal developed for Department of Agriculture Production & Farmers Welfare, Govt. of J&K.',
    enableRegistration: true,
    enableStudentPortal: true,
    enableVerificationService: true,
    maintenanceMode: false,
    primaryThemeColor: '#052e16' // Tailwind emerald-950
  }
};

/**
 * Retrieves the current live site configuration from local storage or returns factory default
 */
export function getSiteConfig(): SiteConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_SITE_CONFIG,
        ...parsed,
        institution: { ...DEFAULT_SITE_CONFIG.institution, ...(parsed.institution || {}) },
        hero: { ...DEFAULT_SITE_CONFIG.hero, ...(parsed.hero || {}) },
        developer: { ...DEFAULT_SITE_CONFIG.developer, ...(parsed.developer || {}) }
      };
    }
  } catch (err) {
    console.error('Error reading site config from storage:', err);
  }
  return DEFAULT_SITE_CONFIG;
}

/**
 * Saves and publishes the updated site configuration live
 */
export function saveSiteConfig(newConfig: SiteConfig): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: newConfig }));
    return true;
  } catch (err) {
    console.error('Error saving site config:', err);
    return false;
  }
}

/**
 * Resets the site configuration back to factory default
 */
export function resetSiteConfig(): SiteConfig {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: DEFAULT_SITE_CONFIG }));
  } catch (err) {
    console.error('Error resetting site config:', err);
  }
  return DEFAULT_SITE_CONFIG;
}

/**
 * React hook to auto-subscribe components to live site configuration changes
 */
export function useSiteConfig(): {
  config: SiteConfig;
  updateConfig: (newConfig: SiteConfig) => boolean;
  resetConfig: () => SiteConfig;
} {
  const [config, setConfig] = useState<SiteConfig>(getSiteConfig);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<SiteConfig>;
      if (customEvent.detail) {
        setConfig(customEvent.detail);
      } else {
        setConfig(getSiteConfig());
      }
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
    };
  }, []);

  return {
    config,
    updateConfig: saveSiteConfig,
    resetConfig: resetSiteConfig
  };
}
