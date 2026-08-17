import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, accessToken } = useAuth();

  const isExpired =
    !!user?.exp && user.exp * 1000 <= Date.now();

  if (!accessToken || !user || isExpired) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
