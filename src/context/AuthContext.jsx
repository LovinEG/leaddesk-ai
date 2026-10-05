import { useEffect, useMemo, useState } from 'react'

import { AuthContext } from './auth-context.js'
import { getSession, onAuthStateChange } from '../lib/auth.js'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    let authEventReceived = false

    const subscription = onAuthStateChange((_event, nextSession) => {
      authEventReceived = true
      setSession(nextSession)
      setError(null)
      setLoading(false)
    })

    getSession()
      .then((currentSession) => {
        if (active && !authEventReceived) {
          setSession(currentSession)
          setLoading(false)
        }
      })
      .catch((sessionError) => {
        if (active && !authEventReceived) {
          setError(sessionError)
          setLoading(false)
        }
      })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      error,
    }),
    [session, loading, error],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
