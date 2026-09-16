import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import AdminApp from './AdminApp.tsx';
import './index.css';
import { FAVICON_DATA_URI } from './assets/faviconBase64';

// Ensure browser tab favicon is set to official university emblem immediately
function setBrowserFavicon() {
  const existingLinks = document.querySelectorAll("link[rel*='icon']");
  existingLinks.forEach(link => link.remove());

  const link = document.createElement('link');
  link.type = 'image/png';
  link.rel = 'icon';
  link.href = FAVICON_DATA_URI;
  document.head.appendChild(link);

  const shortcut = document.createElement('link');
  shortcut.rel = 'shortcut icon';
  shortcut.type = 'image/png';
  shortcut.href = FAVICON_DATA_URI;
  document.head.appendChild(shortcut);

  const appleTouch = document.createElement('link');
  appleTouch.rel = 'apple-touch-icon';
  appleTouch.href = FAVICON_DATA_URI;
  document.head.appendChild(appleTouch);
}

try {
  setBrowserFavicon();
} catch (err) {
  console.warn('Favicon set error:', err);
}

const path = window.location.pathname;

window.addEventListener('error', (e) => {
  document.body.innerHTML += '<div style="position:fixed;top:0;left:0;z-index:9999;background:white;color:red;padding:20px;font-family:monospace;width:100%;height:100%;overflow:auto;">' + (e.error ? e.error.stack : e.message) + '</div>';
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      {path.startsWith('/admin_etcpulwama') ? <AdminApp /> : <App />}
  </StrictMode>,
);
