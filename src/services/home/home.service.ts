interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

export class HomeService {
    /**
     * Verifica el estado del token usando el endpoint específico del backend
     */
    static async verifyTokenStatus(): Promise<{ isValid: boolean; isAlive: boolean }> {
        try {
            // Obtener el access token del localStorage
            const accessToken = localStorage.getItem('access_token') || localStorage.getItem('accessToken');
            
            if (!accessToken) {
                return { isValid: false, isAlive: false };
            }

            const { apiService } = await import('../api.service');
            
            // Hacer la petición al endpoint de verificación
            const response = await apiService.postWithoutAuth<{ isAlive: boolean }>('auth/verify-token', {
                access_token: accessToken
            });

            if (response.success) {
                return { isValid: true, isAlive: response.data.isAlive };
            } else {
                return { isValid: false, isAlive: false };
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            return { isValid: false, isAlive: false };
        }
    }

    /**
     * Renueva el refresh token usando el authService
     */
    static async renewTokens(): Promise<boolean> {
        try {
            const { authService } = await import('../login/auth.service');
            await authService.refreshToken();
            return true;
        } catch (error) {
            console.error('Failed to renew tokens:', error);
            return false;
        }
    }

    /**
     * Verifica y renueva tokens automáticamente
     */
    static async checkAndRefreshTokens(): Promise<boolean> {
        try {
            const tokenStatus = await this.verifyTokenStatus();
            
            if (!tokenStatus.isValid) {
                // No hay token o error en la verificación
                return false;
            }
            
            if (tokenStatus.isAlive) {
                // Token activo, todo bien
                return true;
            }
            
            // Token expirado, intentar renovar con refresh token
            const renewed = await this.renewTokens();
            
            if (!renewed) {
                // Si falla el refresh, limpiar datos
                this.clearUserData();
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Error checking tokens:', error);
            return false;
        }
    }

    /**
     * Obtiene los datos del usuario desde localStorage
     */
    static getUserData(): User | null {
        try {
            const userData = localStorage.getItem('user');
            if (userData) {
                return JSON.parse(userData) as User;
            }
            return null;
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
            return null;
        }
    }

    /**
     * Verifica si el usuario está autenticado
     */
    static isAuthenticated(): boolean {
        const accessToken = localStorage.getItem('access_token') || localStorage.getItem('accessToken');
        const user = this.getUserData();
        return !!(accessToken && user);
    }

    /**
     * Verifica si el usuario es administrador
     */
    static isAdmin(): boolean {
        const user = this.getUserData();
        return user?.role === 'ADMIN';
    }

    /**
     * Obtiene el nombre de usuario
     */
    static getUsername(): string {
        const user = this.getUserData();
        return user?.username || 'Usuario';
    }

    /**
     * Obtiene el email del usuario
     */
    static getUserEmail(): string {
        const user = this.getUserData();
        return user?.email || '';
    }

    /**
     * Obtiene el rol del usuario
     */
    static getUserRole(): string {
        const user = this.getUserData();
        return user?.role || 'USER';
    }

    /**
     * Verifica si el usuario tiene permisos para gestionar usuarios
     */
    static canManageUsers(): boolean {
        return this.isAdmin();
    }

    /**
     * Limpia los datos del usuario (logout)
     */
    static clearUserData(): void {
        try {
            localStorage.removeItem('user');
            localStorage.removeItem('access_token');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('refreshToken');
        } catch (error) {
            console.error('Error al limpiar datos del usuario:', error);
        }
    }
}