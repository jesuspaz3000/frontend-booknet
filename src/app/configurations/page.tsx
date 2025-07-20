import Configurations from "@/views/configurations";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function ConfigurationsPage() {
    return (
        <ProtectedRoute requireAuth={true}>
            <Configurations />
        </ProtectedRoute>
    );
}
