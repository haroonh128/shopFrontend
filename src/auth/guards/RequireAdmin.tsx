import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks";

function isAdminUser(user: { role?: string; isAdmin?: string | boolean } | null) {
  if (!user) return false;
  if (user.role === "Admin") return true;
  if (user.isAdmin === true || user.isAdmin === "true") return true;
  return false;
}

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, accessToken } = useAuth();

  const isExpired = !!user?.exp && user.exp * 1000 <= Date.now();

  if (!accessToken || !user || isExpired) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdminUser(user)) {
    return <Navigate to="/modules" replace />;
  }

  return <>{children}</>;
}
