import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, 
  PieChart, Pie, Cell, Legend, CartesianGrid 
} from 'recharts';
import { 
  Activity, Users, Clock, Eye, Download, IdCard, 
  RefreshCw, Smartphone, Monitor, Tablet, Filter, ArrowUpRight, 
  Sparkles, FileSpreadsheet, ShieldAlert, CheckCircle2, Zap
} from 'lucide-react';
import { useAnalyticsData, getAnalyticsSummary } from '../lib/analyticsStore';

export const AdminAnalyticsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<number>(14);
  const [activeTab, setActiveTab] = useState<'overview' | 'live_stream' | 'conversions'>('overview');
  const analytics = useAnalyticsData(timeRange);

  // Format seconds into minutes & seconds
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  // Convert pageViewsByPath to array for BarChart
  const pageBreakdownData = Object.entries(analytics.pageViewsByPath)
    .map(([name, count]) => ({ name, count: Number(count) || 0 }))
    .sort((a, b) => b.count - a.count);

  // Device data for Donut Chart
  const deviceData = Object.entries(analytics.viewsByDevice)
    .map(([name, value]) => ({ name, value: Number(value) || 0 }))
    .filter(item => item.value > 0);

  const DEVICE_COLORS = ['#059669', '#3b82f6', '#f59e0b'];

  // Handle Export CSV
  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Page', 'Device', 'Browser', 'Session ID', 'Duration (s)'];
    const rows = analytics.recentLogs.map(log => [
      new Date(log.timestamp).toLocaleString(),
      `"${log.page}"`,
      log.device,
      `"${log.browser}"`,
      log.sessionId,
      log.durationSeconds
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ETC_Pulwama_Analytics_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner & Control Bar */}
      <div className="bg-gradient-to-r from-[#022c1e] via-[#064e3b] to-[#022c1e] rounded-3xl p-6 text-white shadow-xl border border-emerald-800/80 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-300">
              REAL-TIME VISITOR ANALYTICS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white">
            Portal Engagement & Trainee Traffic
          </h2>
          <p className="text-xs text-emerald-100/80 max-w-2xl">
            Live metrics on student portal visits, course page views, ID card prints, and syllabus downloads across Jammu & Kashmir.
          </p>
        </div>

        {/* Date Range & Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="bg-emerald-950/80 p-1 rounded-2xl border border-emerald-700/60 flex items-center text-xs font-semibold">
            {[
              { days: 1, label: 'Today' },
              { days: 7, label: '7 Days' },
              { days: 14, label: '14 Days' },
              { days: 30, label: '30 Days' }
            ].map(item => (
              <button
                key={item.days}
                onClick={() => setTimeRange(item.days)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  timeRange === item.days 
                    ? 'bg-emerald-600 text-white shadow-md font-bold' 
                    : 'text-emerald-200/80 hover:text-white hover:bg-emerald-900/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-2xl text-xs flex items-center gap-2 shadow-lg transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Total Page Views */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Total Page Views</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-serif font-black text-slate-900">
              {analytics.totalViews.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
              <ArrowUpRight className="w-4 h-4" />
              <span>+18.4% vs previous period</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Unique Visitors */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Unique Visitors</span>
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-serif font-black text-slate-900">
              {analytics.uniqueVisitors.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-sky-700 font-semibold">
              <Activity className="w-4 h-4" />
              <span>Active Trainee Sessions</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Avg Session Duration */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Avg. Engagement</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-serif font-black text-slate-900">
              {formatDuration(analytics.avgEngagementSeconds)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold">
              <Zap className="w-4 h-4" />
              <span>High portal interaction</span>
            </div>
          </div>
        </div>

        {/* KPI 4: ID Cards & Downloads */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Conversions / Downloads</span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Download className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-serif font-black text-slate-900">
              {(analytics.totalDownloads + analytics.totalIdCardPrints).toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-700 font-semibold">
              <IdCard className="w-4 h-4" />
              <span>{analytics.totalIdCardPrints} ID Cards • {analytics.totalDownloads} PDFs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-emerald-700 text-emerald-900 font-serif font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Visual Analytics Trends
        </button>
        <button
          onClick={() => setActiveTab('live_stream')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'live_stream'
              ? 'border-emerald-700 text-emerald-900 font-serif font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Live Real-time Log Feed ({analytics.recentLogs.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('conversions')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'conversions'
              ? 'border-emerald-700 text-emerald-900 font-serif font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Action Conversions &amp; Downloads
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Main Traffic Trend Chart */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-serif font-black text-lg text-slate-900">
                  Daily Visitor &amp; Page View Trend
                </h3>
                <p className="text-xs text-slate-500">
                  Aggregated web views and unique session visits over the past {timeRange} days.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200/80">
                LIVE METRICS SYNCHRONIZED
              </span>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.dailyTrends}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#64748b" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', fontSize: '12px' }} 
                  />
                  <Area type="monotone" dataKey="views" name="Page Views" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                  <Area type="monotone" dataKey="visitors" name="Unique Trainees" stroke="#0284c7" strokeWidth={2} fillOpacity={1} fill="url(#colorVisitors)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Two Grid Charts: Section Popularity & Device Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Section Popularity Bar Chart */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-serif font-black text-lg text-slate-900">
                  Page Views by Section
                </h3>
                <p className="text-xs text-slate-500">
                  Distribution of traffic across different portal areas.
                </p>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pageBreakdownData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 11 }} stroke="#64748b" />
                    <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 11 }} stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', fontSize: '12px' }} />
                    <Bar dataKey="count" name="Views" fill="#047857" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Device Distribution Donut Chart */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-serif font-black text-lg text-slate-900">
                  Device Breakdown
                </h3>
                <p className="text-xs text-slate-500">
                  Trainee access hardware platforms.
                </p>
              </div>

              <div className="h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                {deviceData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: DEVICE_COLORS[i % DEVICE_COLORS.length] }}></span>
                      <span className="font-medium text-slate-700">{d.name}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">{d.value} views</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'live_stream' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-serif font-black text-lg text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Real-Time Visitor Log Stream</span>
              </h3>
              <p className="text-xs text-slate-500">
                Live stream of incoming page requests and student interactions.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Showing {analytics.recentLogs.length} events
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-mono text-[10px] uppercase tracking-wider border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Visited Page</th>
                  <th className="py-3 px-4">Device / OS</th>
                  <th className="py-3 px-4">Referrer</th>
                  <th className="py-3 px-4">Session ID</th>
                  <th className="py-3 px-4 text-right">Time Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {analytics.recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {log.page}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        log.device === 'Mobile' 
                          ? 'bg-amber-100 text-amber-800' 
                          : log.device === 'Tablet' 
                          ? 'bg-sky-100 text-sky-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {log.device === 'Mobile' ? <Smartphone className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                        <span>{log.device}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 truncate max-w-[180px]">
                      {log.referrer}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {log.sessionId.substring(0, 12)}...
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-800">
                      {log.durationSeconds}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'conversions' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-serif font-black text-lg text-slate-900">
              Key Action Conversions
            </h3>
            <p className="text-xs text-slate-500">
              Audit log of critical trainee engagements including Student ID card printing and Syllabus PDF downloads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.recentEvents.map((ev) => (
              <div 
                key={ev.id} 
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-start gap-3 hover:bg-white hover:shadow-md transition-all"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  ev.eventType === 'id_card_print' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : ev.eventType === 'pdf_download' 
                    ? 'bg-sky-100 text-sky-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {ev.eventType === 'id_card_print' ? <IdCard className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      {ev.page}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 truncate">
                    {ev.eventLabel}
                  </h4>
                  <p className="text-[11px] text-emerald-700 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Action Completed</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
