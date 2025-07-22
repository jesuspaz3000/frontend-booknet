import DashboardLayout from "@/views/dashboard";
import UserManagement from "@/views/dashboard/userManagement";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function Page() {
    return (
        <ProtectedRoute requireAuth={true} requireAdmin={true}>
            <DashboardLayout>
                <UserManagement />
            </DashboardLayout>
        </ProtectedRoute>
    );
}
