// contexts/auth-context.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export type UserRole =
  | "super_admin"
  | "org_admin"
  | "branch_admin"
  | "org_member";

export interface User {
  id: number;
  role: UserRole;
  org_id?: number;
  branch_id?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const userData: User = {
          id: decoded.user_id,
          role: decoded.role,
          org_id: decoded.org_id,
          branch_id: decoded.branch_id,
        };
        setUser(userData);
      } catch (err) {
        console.error("Invalid token", err);
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
// export type { User };
