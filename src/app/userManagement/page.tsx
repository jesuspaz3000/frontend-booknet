import UserManagement from "@/views/userManagement";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function Page() {
    return (
        <ProtectedRoute requireAuth={true} requireAdmin={true}>
            <div>
                <UserManagement />
            </div>
        </ProtectedRoute>
    );
}
