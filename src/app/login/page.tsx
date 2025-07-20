import Login from "@/views/login";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function LoginPage() {
    return (
        <ProtectedRoute requireAuth={false}>
            <div>
                <Login />
            </div>
        </ProtectedRoute>
    );
}
