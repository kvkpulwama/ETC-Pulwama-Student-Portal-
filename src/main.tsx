import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import AdminApp from './AdminApp.tsx';
import { ErrorBoundary } from './ErrorBoundary.tsx';
import './index.css';

const path = window.location.pathname;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      {path.startsWith('/admin_etcpulwama') ? <AdminApp /> : <App />}
    </ErrorBoundary>
  </StrictMode>,
);
