import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, LogOut, Plus, Search } from 'lucide-react'

import { useAuth } from '../../context/auth-context.js'
import { signOut } from '../../lib/auth.js'
import './Topbar.css'

function Topbar({ title, description }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [signingOut, setSigningOut] = useState(false)
  const [logoutError, setLogoutError] = useState('')

  async function handleSignOut() {
    setSigningOut(true)
    setLogoutError('')

    try {
      await signOut()
      navigate('/login', { replace: true })
    } catch (error) {
      setLogoutError(error.message || 'Не удалось выйти. Попробуйте ещё раз.')
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <header className="topbar">
      <div className="topbar__heading">
        <h1 className="topbar__title">{title}</h1>
        {description ? (
          <p className="topbar__description">{description}</p>
        ) : null}
      </div>

      <div className="topbar__tools">
        <label className="topbar__search">
          <Search
            className="topbar__search-icon"
            size={15}
            strokeWidth={1.9}
            aria-hidden="true"
          />
          <input
            type="search"
            className="topbar__search-input"
            placeholder="Поиск по лидам и диалогам"
            aria-label="Поиск по лидам и диалогам"
          />
        </label>

        <div className="topbar__actions">
          <button type="button" className="topbar__action" aria-label="Создать лида">
            <Plus size={16} strokeWidth={1.9} aria-hidden="true" />
          </button>

          <button
            type="button"
            className="topbar__action topbar__action--alert"
            aria-label="Уведомления"
          >
            <Bell size={16} strokeWidth={1.9} aria-hidden="true" />
          </button>
        </div>

        <div className="topbar__user">
          <span className="topbar__avatar" aria-hidden="true">
            {(user?.email?.[0] ?? 'U').toUpperCase()}
          </span>
          <span className="topbar__user-text">
            <span className="topbar__user-name">{user?.email}</span>
            <span className="topbar__user-role">Аккаунт</span>
          </span>
          <button
            type="button"
            className="topbar__logout"
            onClick={handleSignOut}
            disabled={signingOut}
            aria-label="Выйти"
          >
            <LogOut size={15} strokeWidth={1.9} aria-hidden="true" />
            <span>{signingOut ? 'Выходим…' : 'Выйти'}</span>
          </button>
        </div>
      </div>
      {logoutError ? (
        <p className="topbar__error" role="alert">
          {logoutError}
        </p>
      ) : null}
    </header>
  )
}

export default Topbar