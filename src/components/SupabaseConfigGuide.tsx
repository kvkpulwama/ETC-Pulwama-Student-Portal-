import React, { useState, useEffect } from 'react';
import { Database, Key, CheckCircle2, AlertCircle, Copy, ExternalLink, RefreshCw, ShieldCheck, HelpCircle, Lock } from 'lucide-react';
import { activeSupabaseUrl, activeSupabaseKey, updateSupabaseConfig, checkSupabaseConnection } from '../lib/supabase';
import { SUPABASE_RLS_SECURITY_SQL } from '../lib/security';

export const SupabaseConfigGuide: React.FC = () => {
  const [url, setUrl] = useState(activeSupabaseUrl);
  const [key, setKey] = useState(activeSupabaseKey);
  const [status, setStatus] = useState<{ loading: boolean; connected: boolean | null; message: string }>({
    loading: false,
    connected: null,
    message: ''
  });
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const testConnection = async () => {
    setStatus({ loading: true, connected: null, message: 'Testing connection to Supabase...' });
    const result = await checkSupabaseConnection();
    setStatus({ loading: false, connected: result.connected, message: result.message });
  };

  useEffect(() => {
    testConnection();
  }, []);

  const handleSave = () => {
    updateSupabaseConfig(url, key);
    testConnection();
  };

  const handleResetDefaults = () => {
    localStorage.removeItem('etc_supabase_url');
    localStorage.removeItem('etc_supabase_key');
    const defaultUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ssypyegksjrpjgbcoqyc.supabase.co';
    const defaultKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_P19UWTAtI4Ujeg9HrYohqA_s6podg89';
    setUrl(defaultUrl);
    setKey(defaultKey);
    updateSupabaseConfig(defaultUrl, defaultKey);
    testConnection();
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const redirectUrl = typeof window !== 'undefined' ? window.location.origin : 'https://your-app-domain.com';

  return (
    <div className="bg-white rounded-xl shadow-md border border-emerald-100 overflow-hidden text-slate-800">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-700/60 rounded-lg backdrop-blur-sm border border-emerald-500/30">
              <Database className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">Supabase & MCP Database Configuration</h3>
              <p className="text-sm text-emerald-200">Manage credentials, test database status, and configure Google Auth</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {status.connected === true && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Connected
              </span>
            )}
            {status.connected === false && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Check Settings
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Step-by-Step "Where to find your Supabase credentials" */}
        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
          <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
            <HelpCircle className="w-5 h-5 text-emerald-700" />
            Where to get your Supabase URL & Anon API Key:
          </h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 leading-relaxed">
            <li>
              Go to the official <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-emerald-700 font-medium underline inline-flex items-center gap-0.5">Supabase Dashboard <ExternalLink className="w-3 h-3 inline" /></a> and select your project.
            </li>
            <li>
              In the left sidebar menu, click on <strong>Project Settings</strong> (the gear icon <span className="text-xs bg-slate-200 px-1.5 py-0.5 rounded font-mono">⚙️</span> at the bottom left).
            </li>
            <li>
              Click on <strong>API Keys</strong> (or <strong>API</strong>).
            </li>
            <li>
              Copy your <strong>Project URL</strong> (starts with <code className="bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded text-xs font-mono">https://....supabase.co</code>).
            </li>
            <li>
              Copy your <strong>Project API key</strong>:
              <ul className="list-disc list-inside ml-5 mt-1 text-xs text-slate-600 space-y-1">
                <li>Look for the <strong>`anon` `public` key</strong> or <strong>`publishable` key</strong> (starts with <code className="font-mono">sb_publishable_...</code> or <code className="font-mono font-medium">ey...</code>).</li>
              </ul>
            </li>
          </ol>
        </div>

        {/* Credentials Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Supabase Project URL (VITE_SUPABASE_URL)
            </label>
            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-project.supabase.co"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono text-slate-800 pr-10"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(url, 'url')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                title="Copy URL"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            {copiedField === 'url' && <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">Copied to clipboard!</span>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Supabase Anon / Publishable Key (VITE_SUPABASE_ANON_KEY)
            </label>
            <div className="relative">
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="sb_publishable_... or eyJhbG..."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono text-slate-800 pr-10"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(key, 'key')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                title="Copy Key"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            {copiedField === 'key' && <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">Copied to clipboard!</span>}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-lg text-sm transition-colors shadow-sm flex items-center gap-2"
            >
              <Key className="w-4 h-4" /> Save Credentials
            </button>

            <button
              type="button"
              onClick={testConnection}
              disabled={status.loading}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${status.loading ? 'animate-spin' : ''}`} />
              Test Connection
            </button>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3 py-2 text-slate-500 hover:text-slate-800 text-xs font-medium underline ml-auto"
            >
              Reset to Project Defaults
            </button>
          </div>

          {/* Connection Result */}
          {status.message && (
            <div className={`p-3 rounded-lg border text-sm flex items-center gap-3 ${
              status.connected === true ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
              status.connected === false ? 'bg-amber-50 border-amber-200 text-amber-800' :
              'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              {status.connected === true && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
              {status.connected === false && <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />}
              {status.loading && <RefreshCw className="w-5 h-5 text-blue-600 animate-spin shrink-0" />}
              <span>{status.message}</span>
            </div>
          )}
        </div>

        {/* Google OAuth & Google Cloud Console Instructions */}
        <div className="border-t border-slate-200 pt-5">
          <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            Authorised Redirect URIs for Google Cloud Console
          </h4>
          <p className="text-xs text-slate-600 mb-3">
            When setting up Google Sign-In in Google Cloud Console (<a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-medium">console.cloud.google.com</a>), copy these exact URIs into your OAuth 2.0 Client Credentials:
          </p>

          <div className="space-y-3 bg-emerald-50/60 border border-emerald-200 rounded-lg p-4 text-xs text-slate-800">
            {/* Supabase Callback URI */}
            <div>
              <span className="font-bold text-slate-900 block mb-1">
                1. Authorised redirect URIs (For Supabase Auth):
              </span>
              <div className="flex items-center gap-2 bg-white p-2 rounded border border-emerald-300 font-mono text-[11px] text-emerald-900">
                <span>{url.replace(/\/$/, '')}/auth/v1/callback</span>
                <button
                  onClick={() => copyToClipboard(`${url.replace(/\/$/, '')}/auth/v1/callback`, 'supa_callback')}
                  className="ml-auto px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 rounded text-emerald-800 flex items-center gap-1 font-sans text-xs font-medium"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              {copiedField === 'supa_callback' && <span className="text-[10px] text-emerald-600 font-bold mt-0.5 inline-block">Copied Supabase Callback URI!</span>}
            </div>

            {/* Application Web App Redirect URI */}
            <div>
              <span className="font-bold text-slate-900 block mb-1">
                2. Authorised redirect URIs (For Web Portal App):
              </span>
              <div className="flex items-center gap-2 bg-white p-2 rounded border border-emerald-300 font-mono text-[11px] text-emerald-900">
                <span>{redirectUrl}</span>
                <button
                  onClick={() => copyToClipboard(redirectUrl, 'app_redirect')}
                  className="ml-auto px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 rounded text-emerald-800 flex items-center gap-1 font-sans text-xs font-medium"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              {copiedField === 'app_redirect' && <span className="text-[10px] text-emerald-600 font-bold mt-0.5 inline-block">Copied Web App Redirect URI!</span>}
            </div>

            {/* Authorised JavaScript Origins */}
            <div>
              <span className="font-bold text-slate-900 block mb-1">
                3. Authorised JavaScript origins:
              </span>
              <div className="flex items-center gap-2 bg-white p-2 rounded border border-emerald-300 font-mono text-[11px] text-emerald-900">
                <span>{url.replace(/\/$/, '')}</span>
                <button
                  onClick={() => copyToClipboard(url.replace(/\/$/, ''), 'supa_origin')}
                  className="ml-auto px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 rounded text-emerald-800 flex items-center gap-1 font-sans text-xs font-medium"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              {copiedField === 'supa_origin' && <span className="text-[10px] text-emerald-600 font-bold mt-0.5 inline-block">Copied JS Origin!</span>}
            </div>

            <div className="pt-2 border-t border-emerald-200 text-slate-700">
              <p className="font-semibold text-emerald-950 mb-1">Steps to complete in Google Cloud Console & Supabase:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>In Google Cloud Console, navigate to <strong>APIs & Services</strong> &rarr; <strong>Credentials</strong> &rarr; Select your OAuth 2.0 Client ID.</li>
                <li>Paste the <strong>Authorised redirect URIs</strong> copied above into the list and click <strong>Save</strong>.</li>
                <li>Copy your <strong>Client ID</strong> & <strong>Client Secret</strong> from Google Cloud Console.</li>
                <li>In Supabase Dashboard, go to <strong>Authentication</strong> &rarr; <strong>Providers</strong> &rarr; <strong>Google</strong>, paste the credentials and click <strong>Save</strong>.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* High-Level Database Security & Row Level Security (RLS) */}
        <div className="border-t border-slate-200 pt-5">
          <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-amber-600" />
            Database Anti-Breach & Row Level Security (RLS) SQL Script
          </h4>
          <p className="text-xs text-slate-600 mb-2">
            To prevent data leaks and restrict database access exclusively to authorized student owners and admins on <strong className="text-emerald-800">etcpulwama.edu</strong>, run this SQL script in your Supabase SQL Editor:
          </p>

          <div className="relative bg-slate-900 rounded-lg p-3 text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800">
            <button
              onClick={() => copyToClipboard(SUPABASE_RLS_SECURITY_SQL, 'rls_sql')}
              className="absolute top-2 right-2 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-bold rounded flex items-center gap-1 shadow"
            >
              <Copy className="w-3 h-3" /> {copiedField === 'rls_sql' ? 'Copied SQL!' : 'Copy SQL Script'}
            </button>
            <pre className="pr-24">{SUPABASE_RLS_SECURITY_SQL}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
