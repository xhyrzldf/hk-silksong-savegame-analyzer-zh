import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { I18nProvider } from './i18n/I18nContext.tsx'
import { ThemeProvider } from './components/theme-provider'
import { Toaster } from './components/ui/sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="hk-silksong-ui-theme">
      <I18nProvider>
        <App />
        <Toaster />
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
)
