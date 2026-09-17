import { useState, useEffect } from 'react';

export interface PageViewEvent {
  id: string;
  timestamp: string; // ISO string
  page: string;
  path: string;
  referrer: string;
  device: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
  sessionId: string;
  durationSeconds: number;
}

export interface EngagementEvent {
  id: string;
  timestamp: string;
  eventType: 'id_card_print' | 'pdf_download' | 'course_view' | 'search' | 'admission_apply' | 'student_login';
  eventLabel: string;
  page: string;
  metadata?: Record<string, any>;
}

export interface AnalyticsSummary {
  totalViews: number;
  uniqueVisitors: number;
  avgEngagementSeconds: number;
  topPage: string;
  totalDownloads: number;
  totalIdCardPrints: number;
  pageViewsByPath: Record<string, number>;
  viewsByDevice: Record<string, number>;
  hourlyTrends: Array<{ hour: string; views: number; visitors: number }>;
  dailyTrends: Array<{ date: string; views: number; visitors: number; downloads: number }>;
  recentLogs: PageViewEvent[];
  recentEvents: EngagementEvent[];
}

const ANALYTICS_STORAGE_KEY = 'etc_analytics_logs_v1';
const ENGAGEMENT_STORAGE_KEY = 'etc_analytics_events_v1';
const EVENT_NAME = 'etc_analytics_updated';

// Helper to generate realistic seed data if none exists
function generateSeedAnalyticsData(): { pageViews: PageViewEvent[]; events: EngagementEvent[] } {
  const pageViews: PageViewEvent[] = [];
  const events: EngagementEvent[] = [];
  const now = new Date();
  
  const pages = [
    { page: 'Home', path: '/' },
    { page: 'Courses & Diplomas', path: '/courses' },
    { page: 'Student ID Card Portal', path: '/idcard' },
    { page: 'Downloads & Forms', path: '/downloads' },
    { page: 'About ETC Pulwama', path: '/about' },
    { page: 'Contact & Helpline', path: '/contact' },
    { page: 'FAQ & Verification', path: '/faq' },
    { page: 'Student Portal Login', path: '/auth' },
  ];

  const devices: Array<'Desktop' | 'Mobile' | 'Tablet'> = ['Desktop', 'Mobile', 'Mobile', 'Mobile', 'Desktop', 'Tablet'];
  const browsers = ['Chrome 128', 'Safari iOS 18', 'Edge 128', 'Firefox 130', 'Chrome Android'];

  // Seed last 14 days of realistic traffic
  for (let i = 13; i >= 0; i--) {
    const dayDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dayViewsCount = Math.floor(120 + Math.random() * 180 + (i === 0 ? 45 : 0));

    for (let j = 0; j < dayViewsCount; j++) {
      const p = pages[Math.floor(Math.random() * pages.length)];
      const dev = devices[Math.floor(Math.random() * devices.length)];
      const br = browsers[Math.floor(Math.random() * browsers.length)];
      const eventTime = new Date(dayDate.getTime() + Math.random() * 24 * 60 * 60 * 1000);
      const sessId = `sess_${Math.floor(100000 + Math.random() * 900000)}`;

      pageViews.push({
        id: `pv_${eventTime.getTime()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: eventTime.toISOString(),
        page: p.page,
        path: p.path,
        referrer: Math.random() > 0.4 ? 'Direct / Bookmark' : 'Google Search J&K Agriculture',
        device: dev,
        browser: br,
        sessionId: sessId,
        durationSeconds: Math.floor(15 + Math.random() * 280)
      });

      // Sample engagement conversion
      if (Math.random() < 0.15) {
        const types: Array<{ type: EngagementEvent['eventType']; label: string }> = [
          { type: 'id_card_print', label: 'Student ID Card CR80 Print Launched' },
          { type: 'pdf_download', label: 'BHT Syllabus 2026-27 Downloaded' },
          { type: 'course_view', label: 'Basic Horticulture Diploma View Details' },
          { type: 'admission_apply', label: 'Online Application Modal Opened' },
          { type: 'student_login', label: 'Trainee Portal Session Authenticated' }
        ];
        const selectedEv = types[Math.floor(Math.random() * types.length)];
        events.push({
          id: `ev_${eventTime.getTime()}_${Math.random().toString(36).substring(2, 6)}`,
          timestamp: eventTime.toISOString(),
          eventType: selectedEv.type,
          eventLabel: selectedEv.label,
          page: p.page
        });
      }
    }
  }

  // Sort descending
  pageViews.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return { pageViews, events };
}

// Get Session ID
function getSessionId(): string {
  let sess = sessionStorage.getItem('etc_analytics_session_id');
  if (!sess) {
    sess = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    sessionStorage.setItem('etc_analytics_session_id', sess);
  }
  return sess;
}

// Detect device
function detectDevice(): 'Desktop' | 'Mobile' | 'Tablet' {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'Mobile';
  }
  return 'Desktop';
}

/**
 * Tracks a page view event
 */
export function trackPageView(pageName: string, pathName: string = window.location.pathname) {
  try {
    const rawPvs = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    let pvs: PageViewEvent[] = [];
    if (rawPvs) {
      pvs = JSON.parse(rawPvs);
    } else {
      pvs = generateSeedAnalyticsData().pageViews;
    }

    const newPv: PageViewEvent = {
      id: `pv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      page: pageName,
      path: pathName,
      referrer: document.referrer || 'Direct Portal Visit',
      device: detectDevice(),
      browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Safari') ? 'Safari' : 'Browser',
      sessionId: getSessionId(),
      durationSeconds: Math.floor(10 + Math.random() * 60)
    };

    const updated = [newPv, ...pvs].slice(0, 5000); // Keep last 5,000 views
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch (e) {
    console.error('Error tracking page view:', e);
  }
}

/**
 * Tracks interactive engagement events (downloads, ID card prints, searches)
 */
export function trackEngagementEvent(
  eventType: EngagementEvent['eventType'],
  eventLabel: string,
  pageName: string,
  metadata?: Record<string, any>
) {
  try {
    const rawEvs = localStorage.getItem(ENGAGEMENT_STORAGE_KEY);
    let evs: EngagementEvent[] = [];
    if (rawEvs) {
      evs = JSON.parse(rawEvs);
    } else {
      evs = generateSeedAnalyticsData().events;
    }

    const newEv: EngagementEvent = {
      id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      eventType,
      eventLabel,
      page: pageName,
      metadata
    };

    const updated = [newEv, ...evs].slice(0, 2000);
    localStorage.setItem(ENGAGEMENT_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch (e) {
    console.error('Error tracking engagement event:', e);
  }
}

/**
 * Get compiled analytics summary stats
 */
export function getAnalyticsSummary(timeRangeDays: number = 14): AnalyticsSummary {
  let pvs: PageViewEvent[] = [];
  let evs: EngagementEvent[] = [];

  try {
    const rawPvs = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    const rawEvs = localStorage.getItem(ENGAGEMENT_STORAGE_KEY);

    if (rawPvs && rawEvs) {
      pvs = JSON.parse(rawPvs);
      evs = JSON.parse(rawEvs);
    } else {
      const seed = generateSeedAnalyticsData();
      pvs = seed.pageViews;
      evs = seed.events;
      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(pvs));
      localStorage.setItem(ENGAGEMENT_STORAGE_KEY, JSON.stringify(evs));
    }
  } catch (e) {
    const seed = generateSeedAnalyticsData();
    pvs = seed.pageViews;
    evs = seed.events;
  }

  const cutoff = new Date(Date.now() - timeRangeDays * 24 * 60 * 60 * 1000);
  const filteredPvs = pvs.filter(pv => new Date(pv.timestamp) >= cutoff);
  const filteredEvs = evs.filter(ev => new Date(ev.timestamp) >= cutoff);

  const uniqueSessions = new Set(filteredPvs.map(p => p.sessionId));
  const pageViewsByPath: Record<string, number> = {};
  const viewsByDevice: Record<string, number> = { Desktop: 0, Mobile: 0, Tablet: 0 };
  let totalDuration = 0;

  filteredPvs.forEach(pv => {
    pageViewsByPath[pv.page] = (pageViewsByPath[pv.page] || 0) + 1;
    viewsByDevice[pv.device] = (viewsByDevice[pv.device] || 0) + 1;
    totalDuration += pv.durationSeconds || 30;
  });

  // Find top page
  let topPage = 'Home';
  let maxCount = 0;
  Object.entries(pageViewsByPath).forEach(([pg, cnt]) => {
    if (cnt > maxCount) {
      maxCount = cnt;
      topPage = pg;
    }
  });

  // Calculate daily trend
  const dailyMap: Record<string, { views: number; sessions: Set<string>; downloads: number }> = {};
  for (let i = timeRangeDays - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dailyMap[dateStr] = { views: 0, sessions: new Set(), downloads: 0 };
  }

  filteredPvs.forEach(pv => {
    const dateStr = new Date(pv.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (dailyMap[dateStr]) {
      dailyMap[dateStr].views += 1;
      dailyMap[dateStr].sessions.add(pv.sessionId);
    }
  });

  filteredEvs.forEach(ev => {
    const dateStr = new Date(ev.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (dailyMap[dateStr] && ev.eventType === 'pdf_download') {
      dailyMap[dateStr].downloads += 1;
    }
  });

  const dailyTrends = Object.entries(dailyMap).map(([date, data]) => ({
    date,
    views: data.views,
    visitors: data.sessions.size,
    downloads: data.downloads
  }));

  // Hourly trends for today
  const hourlyMap: Record<string, { views: number; sessions: Set<string> }> = {};
  for (let h = 0; h < 24; h++) {
    const hrLabel = `${h.toString().padStart(2, '0')}:00`;
    hourlyMap[hrLabel] = { views: 0, sessions: new Set() };
  }

  const todayStr = new Date().toDateString();
  filteredPvs.filter(pv => new Date(pv.timestamp).toDateString() === todayStr).forEach(pv => {
    const h = new Date(pv.timestamp).getHours();
    const hrLabel = `${h.toString().padStart(2, '0')}:00`;
    if (hourlyMap[hrLabel]) {
      hourlyMap[hrLabel].views += 1;
      hourlyMap[hrLabel].sessions.add(pv.sessionId);
    }
  });

  const hourlyTrends = Object.entries(hourlyMap).map(([hour, data]) => ({
    hour,
    views: data.views,
    visitors: data.sessions.size
  }));

  const totalDownloads = filteredEvs.filter(e => e.eventType === 'pdf_download').length;
  const totalIdCardPrints = filteredEvs.filter(e => e.eventType === 'id_card_print').length;

  return {
    totalViews: filteredPvs.length,
    uniqueVisitors: uniqueSessions.size,
    avgEngagementSeconds: Math.round(filteredPvs.length ? totalDuration / filteredPvs.length : 0),
    topPage,
    totalDownloads,
    totalIdCardPrints,
    pageViewsByPath,
    viewsByDevice,
    hourlyTrends,
    dailyTrends,
    recentLogs: filteredPvs.slice(0, 50),
    recentEvents: filteredEvs.slice(0, 50)
  };
}

/**
 * React Hook to subscribe to real-time analytics updates
 */
export function useAnalyticsData(timeRangeDays: number = 14) {
  const [data, setData] = useState<AnalyticsSummary>(() => getAnalyticsSummary(timeRangeDays));

  useEffect(() => {
    const handleUpdate = () => {
      setData(getAnalyticsSummary(timeRangeDays));
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    const timer = setInterval(() => {
      // Refresh real-time stats periodically
      setData(getAnalyticsSummary(timeRangeDays));
    }, 10000);

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      clearInterval(timer);
    };
  }, [timeRangeDays]);

  return data;
}
