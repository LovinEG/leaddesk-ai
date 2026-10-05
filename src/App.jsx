import { Navigate, Route, Routes } from 'react-router-dom'

import AppLayout from './components/layout/AppLayout.jsx'
import { useAuth } from './context/auth-context.js'
import LoginPage from './pages/LoginPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import LeadsPage from './pages/LeadsPage.jsx'
import LeadPage from './pages/LeadPage.jsx'
import ConversationsPage from './pages/ConversationsPage.jsx'
import AiRulesPage from './pages/AiRulesPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'

function ProtectedLayout() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <main className="auth-loading" role="status">
        <span className="auth-loading__spinner" aria-hidden="true" />
        <span>Проверяем авторизацию…</span>
      </main>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <AppLayout />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/leads/:id" element={<LeadPage />} />
        <Route path="/conversations" element={<ConversationsPage />} />
        <Route path="/ai-rules" element={<AiRulesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
