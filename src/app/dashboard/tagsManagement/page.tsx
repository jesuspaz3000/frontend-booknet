import DashboardLayout from "@/views/dashboard";
import TagsManagement from "@/views/dashboard/tagsManagement";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function Page() {
    return (
        <ProtectedRoute requireAuth={true} requireAdmin={true}>
            <DashboardLayout>
                <TagsManagement />
            </DashboardLayout>
        </ProtectedRoute>
    );
}