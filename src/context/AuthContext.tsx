import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

// Define user type
type UserRole = 'org-admin' | 'branch-admin' | 'employee' | 'superadmin'

interface User {
  name: string
  role: UserRole
}

// Define context shape
interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Simulate login
  useEffect(() => {
    const fakeUser: User = {
      name: 'John Doe',
      role: 'superadmin', //change this for testing different roles from these:('org-admin', 'branch-admin', 'employee', 'superadmin')
    }

    setTimeout(() => {
      setUser(fakeUser)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return <div>Loading...</div> // Show loading screen while user is being set
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider }
