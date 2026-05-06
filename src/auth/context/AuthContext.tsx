// auth/context/AuthContext.tsx
import { createContext, useState, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { JwtUser } from "../models";
import { getItem, removeItem, setItem } from "../../shared";

interface AuthContextType {
  user: JwtUser | null;
  accessToken: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
const AUTH_STORAGE_KEY = "auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return getItem(AUTH_STORAGE_KEY);
  });
  const [user, setUser] = useState<JwtUser | null>(() => {
    const persistedToken = getItem(AUTH_STORAGE_KEY);
    if (!persistedToken) return null;
    try {
      return jwtDecode<JwtUser>(persistedToken);
    } catch {
      removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  });

  const login = (token: string) => {
    if (typeof token !== "string" || token.trim().length === 0) {
      throw new Error("Invalid access token");
    }
    setItem(AUTH_STORAGE_KEY, token);
    setAccessToken(token);
    setUser(jwtDecode<JwtUser>(token));
  };

  const logout = () => {
    removeItem(AUTH_STORAGE_KEY);
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
