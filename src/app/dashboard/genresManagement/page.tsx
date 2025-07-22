import DashboardLayout from "@/views/dashboard";
import GenresManagement from "@/views/dashboard/genresManagement";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function Page() {
    return (
        <ProtectedRoute requireAuth={true} requireAdmin={true}>
            <DashboardLayout>
                <GenresManagement />
            </DashboardLayout>
        </ProtectedRoute>
    );
}