import { Outlet, useLocation } from 'react-router-dom'

import { getPageMeta } from '../../lib/navigation.js'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import './AppLayout.css'

function AppLayout() {
  const { pathname } = useLocation()
  const { label, description } = getPageMeta(pathname)

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-main">
        <Topbar title={label} description={description} />

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout