import DashboardLayout from "@/views/dashboard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import DashboardHome from "@/views/dashboard/home";

export default function Page() {
    return (
        <ProtectedRoute requireAuth={true} requireAdmin={true}>
            <DashboardLayout>
                <DashboardHome />
            </DashboardLayout>
        </ProtectedRoute>
    );
}