import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/theme.css';
import './styles/components.css';

// Fix blank page on browser back/forward navigation (bfcache issue)
// When Chrome restores a page from bfcache, the React root can become disconnected
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    // Page was restored from bfcache — force reload to re-initialize React
    window.location.reload();
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
