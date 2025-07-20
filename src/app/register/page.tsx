import Register from '@/views/register';
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function RegisterPage() {
    return (
        <ProtectedRoute requireAuth={false}>
            <div>
                <Register />
            </div>
        </ProtectedRoute>
    );
}