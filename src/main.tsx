import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { CustomerPage } from './components/CustomerPage.tsx';

const rootElement = document.getElementById('root')!;

// Simple conditional routing based on pathname
const path = window.location.pathname;

if (path.includes('/scan')) {
  createRoot(rootElement).render(
    <StrictMode>
      <CustomerPage />
    </StrictMode>,
  );
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
