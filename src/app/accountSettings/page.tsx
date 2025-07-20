import AccountSettings from "@/views/accountSettings";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function AccountSettingsPage() {
    return (
        <ProtectedRoute requireAuth={true}>
            <AccountSettings />
        </ProtectedRoute>
    );
}
