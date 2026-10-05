import { useState } from 'react'
import { ArrowRight, LockKeyhole } from 'lucide-react'
import { Navigate } from 'react-router-dom'

import { useAuth } from '../context/auth-context.js'
import { signIn } from '../lib/auth.js'
import './LoginPage.css'

function LoginPage() {
  const { session, loading: authLoading, error: authError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (authLoading) {
    return (
      <main className="auth-loading" role="status">
        <span className="auth-loading__spinner" aria-hidden="true" />
        <span>Проверяем авторизацию…</span>
      </main>
    )
  }

  if (session) {
    return <Navigate to="/dashboard" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await signIn(email, password)
    } catch (signInError) {
      setError(signInError.message || 'Не удалось выполнить вход. Попробуйте ещё раз.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-card__brand">
          <span className="login-card__brand-mark" aria-hidden="true">
            LD
          </span>
          <span>LeadDesk AI</span>
        </div>

        <div className="login-card__intro">
          <span className="login-card__icon" aria-hidden="true">
            <LockKeyhole size={19} strokeWidth={1.8} />
          </span>
          <h1 id="login-title">С возвращением</h1>
          <p>Войдите в рабочее пространство LeadDesk AI</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-form__field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              autoComplete="username"
              placeholder="name@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={submitting}
            />
          </label>

          <label className="login-form__field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Введите пароль"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={submitting}
            />
          </label>

          {authError || error ? (
            <p className="login-form__error" role="alert">
              {error || authError.message}
            </p>
          ) : null}

          <button
            className="login-form__submit"
            type="submit"
            disabled={submitting}
          >
            <span>{submitting ? 'Входим…' : 'Войти'}</span>
            {!submitting ? (
              <ArrowRight size={17} strokeWidth={1.9} aria-hidden="true" />
            ) : null}
          </button>
        </form>
      </section>
    </main>
  )
}

export default LoginPage
