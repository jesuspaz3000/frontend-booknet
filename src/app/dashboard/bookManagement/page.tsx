import DashboardLayout from "@/views/dashboard";
import BookManagement from "@/views/dashboard/bookManagement";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function Page() {
    return (
        <ProtectedRoute requireAuth={true} requireAdmin={true}>
            <DashboardLayout>
                <BookManagement />
            </DashboardLayout>
        </ProtectedRoute>
    );
}