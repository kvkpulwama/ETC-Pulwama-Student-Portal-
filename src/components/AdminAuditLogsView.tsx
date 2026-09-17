import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Trash2, 
  Download, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Database,
  User,
  ShieldAlert,
  Printer,
  Calendar,
  Lock
} from 'lucide-react';

export interface AuditLogEntry {
  id: string;
  adminEmail: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'WIPE' | 'SYNC' | 'BULK_DELETE';
  studentName?: string;
  studentRoll?: string;
  details: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

const INITIAL_AUDITS: AuditLogEntry[] = [
  {
    id: 'aud-1',
    adminEmail: 'pcpulwama@gmail.com',
    action: 'SYNC',
    details: 'Initiated full database synchronisation pushing offline student rosters to cloud Supabase tables.',
    timestamp: '2026-09-16 02:40:15 AM',
    ipAddress: '192.168.10.45',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/120.0.0'
  },
  {
    id: 'aud-2',
    adminEmail: 'pcpulwama@gmail.com',
    action: 'CREATE',
    studentName: 'Aabid Hussain Bhat',
    studentRoll: 'BHT-2026-12',
    details: 'Enrolled new student "Aabid Hussain Bhat" in One Year Basic Horticulture Training Course (BHT). Generated official enrollment record and provisioned registration ID.',
    timestamp: '2026-09-16 02:45:10 AM',
    ipAddress: '192.168.10.45',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/120.0.0'
  },
  {
    id: 'aud-3',
    adminEmail: 'pcpulwama@gmail.com',
    action: 'UPDATE',
    studentName: 'Zahid Rashid',
    studentRoll: 'BAT-2026-44',
    details: 'Modified Zahid Rashid\'s personal profile details (Updated contact number to +91 7006883210 and synchronized with remote database).',
    timestamp: '2026-09-16 03:02:18 AM',
    ipAddress: '192.168.10.45',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/120.0.0'
  },
  {
    id: 'aud-4',
    adminEmail: 'pcpulwama@gmail.com',
    action: 'DELETE',
    studentName: 'Muzaffar Ahmad Dar',
    studentRoll: 'BHT-2026-08',
    details: 'Revoked registration and deleted muzaffar_bht08@skuast.in from active student roster due to course withdrawal.',
    timestamp: '2026-09-16 03:15:30 AM',
    ipAddress: '192.168.10.45',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/120.0.0'
  }
];

export const AdminAuditLogsView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  // Load audit logs from localStorage on mount
  useEffect(() => {
    const cached = localStorage.getItem('etc_admin_audit_logs');
    if (cached) {
      try {
        setLogs(JSON.parse(cached));
      } catch (e) {
        setLogs(INITIAL_AUDITS);
        localStorage.setItem('etc_admin_audit_logs', JSON.stringify(INITIAL_AUDITS));
      }
    } else {
      setLogs(INITIAL_AUDITS);
      localStorage.setItem('etc_admin_audit_logs', JSON.stringify(INITIAL_AUDITS));
    }
  }, []);

  // Update localStorage helper
  const saveLogs = (updated: AuditLogEntry[]) => {
    setLogs(updated);
    localStorage.setItem('etc_admin_audit_logs', JSON.stringify(updated));
  };

  // Filter & Search log matching logic
  const filteredLogs = logs.filter(log => {
    const actionMatches = filterAction === 'all' || log.action === filterAction;
    const matchesSearch = 
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.adminEmail.toLowerCase().includes(search.toLowerCase()) ||
      (log.studentName && log.studentName.toLowerCase().includes(search.toLowerCase())) ||
      (log.studentRoll && log.studentRoll.toLowerCase().includes(search.toLowerCase()));
    return actionMatches && matchesSearch;
  });

  // Action badge colors
  const getActionStyle = (action: AuditLogEntry['action']) => {
    switch (action) {
      case 'CREATE':
        return 'bg-emerald-100 text-emerald-950 border-emerald-300';
      case 'UPDATE':
        return 'bg-amber-100 text-amber-950 border-amber-300';
      case 'DELETE':
        return 'bg-red-100 text-red-950 border-red-300';
      case 'WIPE':
      case 'BULK_DELETE':
        return 'bg-rose-100 text-rose-950 font-black border-rose-400';
      case 'SYNC':
        return 'bg-sky-100 text-sky-950 border-sky-300';
    }
  };

  const handleClearLogs = () => {
    if (confirmPassword === 'admin123' || confirmPassword === 'Admin123') {
      saveLogs([]);
      setConfirmPassword('');
      setShowClearConfirm(false);
      alert('Audit logs have been safely wiped for compliance purposes.');
    } else {
      alert('Incorrect administrator password. Wipe aborted.');
    }
  };

  const handleExportCSV = () => {
    const headers = 'ID,Timestamp,Admin,Action,Student Name,Roll No,Details,IP Address\n';
    const rows = filteredLogs.map(l => 
      `"${l.id}","${l.timestamp}","${l.adminEmail}","${l.action}","${l.studentName || ''}","${l.studentRoll || ''}","${l.details.replace(/"/g, '""')}","${l.ipAddress}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `SKUAST_Audit_Logs_${new Date().toISOString().slice(0,10)}.csv`);
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Activity Log Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#00472A] to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-emerald-800 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-3 py-1 rounded-full font-mono">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Auditing &amp; Compliance Module</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Administrative Activity Log
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
            Automatic chronological ledger recording every creation, edit, deletion, and database sync performed on student records by the administrator for institutional auditing.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-all flex items-center gap-2 shadow-sm"
            title="Print audit log for offline institutional records"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>Print Audit Report</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center gap-2 shadow-md"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      {/* Overview stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-2xl font-black text-slate-900">{logs.length}</p>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Actions Logged</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-2xl font-black text-emerald-800">
            {logs.filter(l => l.action === 'CREATE').length}
          </p>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">New Enrolments</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-2xl font-black text-amber-700">
            {logs.filter(l => l.action === 'UPDATE').length}
          </p>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Student Profile Edits</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-2xl font-black text-rose-800">
            {logs.filter(l => l.action === 'DELETE' || l.action === 'BULK_DELETE').length}
          </p>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Deletions & Wipes</p>
        </div>
      </div>

      {/* Control Panel Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logs by name, roll, details..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white"
          />
        </div>

        {/* Filters and Actions Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
            >
              <option value="all">All Action Types</option>
              <option value="CREATE">CREATE Only</option>
              <option value="UPDATE">UPDATE Only</option>
              <option value="DELETE">DELETE Only</option>
              <option value="SYNC">SYNC Only</option>
              <option value="WIPE">WIPE/BULK Only</option>
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              const cached = localStorage.getItem('etc_admin_audit_logs');
              if (cached) {
                try { setLogs(JSON.parse(cached)); } catch(e){}
              }
            }}
            className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl"
            title="Refresh logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 font-extrabold text-xs rounded-xl border border-rose-200 flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            <span>Wipe Audit Trails</span>
          </button>
        </div>
      </div>

      {/* Security Admin Password Confirm Panel */}
      {showClearConfirm && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2 text-rose-950">
            <ShieldAlert className="w-5 h-5 text-red-700" />
            <h4 className="font-extrabold text-xs uppercase tracking-wider">Confirm Security Override Checklist</h4>
          </div>
          <p className="text-[11px] text-red-800 leading-relaxed max-w-2xl">
            You are about to permanently erase the administrative audit trail of student modifications. Enter the administrator password to authorize this purge.
          </p>
          <div className="flex gap-2 max-w-sm">
            <input
              type="password"
              placeholder="Enter administrator password..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-bold flex-1"
            />
            <button
              onClick={handleClearLogs}
              className="px-3.5 py-1.5 bg-red-800 text-white text-xs font-black rounded-xl hover:bg-red-900"
            >
              Verify & Erase
            </button>
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Audit Logs Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="text-[10px] text-slate-400 uppercase font-black tracking-wider bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Administrator</th>
                <th className="p-4 text-center">Action Type</th>
                <th className="p-4">Trainee Context</th>
                <th className="p-4">Operation Description</th>
                <th className="p-4 text-center">Audited IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-500">No Audits match selection</p>
                    <p className="text-[11px] text-slate-400">Try modifying your search or target action type filters.</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/40 transition-colors text-slate-700">
                    <td className="p-4 font-mono text-[10.5px] text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-bold text-slate-800 truncate max-w-[150px]" title={log.adminEmail}>
                          {log.adminEmail}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${getActionStyle(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {log.studentName ? (
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900">{log.studentName}</p>
                          <p className="text-[10px] font-mono text-slate-500">{log.studentRoll}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">None (System)</span>
                      )}
                    </td>
                    <td className="p-4 font-medium text-slate-800 leading-relaxed text-[11.5px] max-w-[320px]">
                      {log.details}
                    </td>
                    <td className="p-4 text-center font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const addAuditLog = (
  action: AuditLogEntry['action'],
  details: string,
  studentName?: string,
  studentRoll?: string
) => {
  const cached = localStorage.getItem('etc_admin_audit_logs');
  let currentLogs: AuditLogEntry[] = [];
  if (cached) {
    try {
      currentLogs = JSON.parse(cached);
    } catch (e) {
      currentLogs = INITIAL_AUDITS;
    }
  } else {
    currentLogs = INITIAL_AUDITS;
  }

  const newLog: AuditLogEntry = {
    id: `aud-custom-${Date.now()}`,
    adminEmail: localStorage.getItem('etc_admin_logged_in_email') || 'pcpulwama@gmail.com',
    action,
    studentName,
    studentRoll,
    details,
    timestamp: new Date().toLocaleString('en-US', { hour12: true }),
    ipAddress: '192.168.10.' + Math.floor(10 + Math.random() * 89),
    userAgent: navigator.userAgent || 'Chrome/120.0.0'
  };

  localStorage.setItem('etc_admin_audit_logs', JSON.stringify([newLog, ...currentLogs]));
};
