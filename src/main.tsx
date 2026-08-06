import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import AdminApp from './AdminApp.tsx';
import './index.css';

const path = window.location.pathname;

window.addEventListener('error', (e) => {
  document.body.innerHTML += '<div style="position:fixed;top:0;left:0;z-index:9999;background:white;color:red;padding:20px;font-family:monospace;width:100%;height:100%;overflow:auto;">' + (e.error ? e.error.stack : e.message) + '</div>';
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      {path.startsWith('/admin_etcpulwama') ? <AdminApp /> : <App />}
  </StrictMode>,
);
