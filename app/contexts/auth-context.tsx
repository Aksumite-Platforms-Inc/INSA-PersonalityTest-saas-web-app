// contexts/auth-context.tsx

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  name: string;
  role: "superadmin" | "org_admin" | "branch_manager" | "employee";
  permissions: string[];
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
    const token = localStorage.getItem("token"); // use cookies if HttpOnly
    if (token) {
      try {
        const decoded: User = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token:", err);
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
