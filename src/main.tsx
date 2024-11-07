import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'primereact/resources/themes/lara-light-blue/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import 'primeflex/primeflex.css'; // flex
import { PrimeReactProvider } from 'primereact/api';

createRoot(document.getElementById('root')!).render(
  <PrimeReactProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </PrimeReactProvider>
)
