// auth/context/AuthContext.tsx
import { createContext, useState, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { JwtUser } from "../models";

interface AuthContextType {
  user: JwtUser | null;
  accessToken: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<JwtUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = (token: string) => {
    setAccessToken(token);
    setUser(jwtDecode<JwtUser>(token));
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
