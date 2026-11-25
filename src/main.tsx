import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './index.css'
import App from './App.tsx'
import { ConnectionProvider } from './context/ConnectionContext'
import { appTheme } from './theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <ConnectionProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConnectionProvider>
    </ThemeProvider>
  </StrictMode>,
)
