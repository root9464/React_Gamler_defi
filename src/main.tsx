import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import QueryProvider from './components/providers/query.tsx';
import { TonProvider } from './components/providers/ton.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <TonProvider>
        <App />
      </TonProvider>
    </QueryProvider>
  </StrictMode>,
);
