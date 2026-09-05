import React from 'react';
import ReactDOM from 'react-dom/client';

// first: the 3D scene reads its colours off the stylesheet's custom properties
import '@/index.css';
import App from '@/app';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
