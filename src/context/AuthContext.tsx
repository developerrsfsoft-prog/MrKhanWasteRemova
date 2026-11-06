import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { login as apiLogin, verifyToken, type AuthUser } from "@/services/api"

interface AuthState {
  user: AuthUser | null
  token: string | null
  loading: boolean
  error: string | null
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem("admin_token"),
    loading: true,
    error: null,
  })

  // Verify stored token on mount
  useEffect(() => {
    const stored = localStorage.getItem("admin_token")
    if (!stored) {
      setState(s => ({ ...s, loading: false }))
      return
    }
    verifyToken()
      .then(({ user }) => setState({ user, token: stored, loading: false, error: null }))
      .catch(() => {
        localStorage.removeItem("admin_token")
        setState({ user: null, token: null, loading: false, error: null })
      })
  }, [])

  const login = async (email: string, password: string) => {
    setState(s => ({ ...s, loading: true, error: null }))
    try {
      const { token, user } = await apiLogin(email, password)
      localStorage.setItem("admin_token", token)
      setState({ user, token, loading: false, error: null })
    } catch (err) {
      setState(s => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : "Login failed",
      }))
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem("admin_token")
    setState({ user: null, token: null, loading: false, error: null })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
