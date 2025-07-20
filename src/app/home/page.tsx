import Home from "@/views/home";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function HomePage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <div>
        <Home />
      </div>
    </ProtectedRoute>
  );
}
