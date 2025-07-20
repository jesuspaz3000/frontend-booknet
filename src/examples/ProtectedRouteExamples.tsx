// Ejemplo de uso de los HOCs de autenticación

import { withAuth, withAdminAuth } from '@/components/auth/ProtectedRoute';

// Ejemplo 1: Página que requiere autenticación
const ConfigurationsComponent = () => {
  return (
    <div>
      <h1>Configuraciones</h1>
      <p>Esta página requiere autenticación</p>
    </div>
  );
};

export const ProtectedConfigurations = withAuth(ConfigurationsComponent);

// Ejemplo 2: Página que requiere permisos de administrador
const AdminPanelComponent = () => {
  return (
    <div>
      <h1>Panel de Administración</h1>
      <p>Esta página solo está disponible para administradores</p>
    </div>
  );
};

export const AdminPanel = withAdminAuth(AdminPanelComponent);

// Ejemplo 3: Uso con opciones personalizadas
const SpecialPageComponent = () => {
  return (
    <div>
      <h1>Página Especial</h1>
      <p>Esta página redirige a una ubicación personalizada</p>
    </div>
  );
};

export const SpecialPage = withAuth(SpecialPageComponent, {
  redirectTo: '/custom-login',
});

// Uso en páginas de Next.js:
/*
// En app/admin/page.tsx
import { AdminPanel } from '@/examples/ProtectedRouteExamples';

export default function AdminPage() {
  return <AdminPanel />;
}

// En app/config/page.tsx
import { ProtectedConfigurations } from '@/examples/ProtectedRouteExamples';

export default function ConfigPage() {
  return <ProtectedConfigurations />;
}
*/
