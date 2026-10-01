import { Navigate, Route, Routes } from 'react-router-dom'

import AppLayout from './components/layout/AppLayout.jsx'
import LoginPage from './pages/LoginPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import LeadsPage from './pages/LeadsPage.jsx'
import LeadPage from './pages/LeadPage.jsx'
import ConversationsPage from './pages/ConversationsPage.jsx'
import AiRulesPage from './pages/AiRulesPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<AppLayout />}>
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
