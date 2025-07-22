import DashboardLayout from "@/views/dashboard";
import AuthorManagement from "@/views/dashboard/authorManagement";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function Page() {
    return (
        <ProtectedRoute requireAuth={true} requireAdmin={true}>
            <DashboardLayout>
                <AuthorManagement />
            </DashboardLayout>
        </ProtectedRoute>
    );
}