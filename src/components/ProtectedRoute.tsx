import { Navigate } from "react-router-dom";
import { useAuthState } from "../hooks/useAuthState";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthState();

  if (loading) {
    return <div>Loading auth...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
