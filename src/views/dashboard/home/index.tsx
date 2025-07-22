'use client';

import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Paper,
    Avatar,
    Chip,
    LinearProgress
} from '@mui/material';
import {
    People as PeopleIcon,
    Person as PersonIcon,
    Category as CategoryIcon,
    LocalOffer as TagIcon,
    MenuBook as BookIcon,
    TrendingUp as TrendingUpIcon,
    Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface StatsCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    color: string;
    path: string;
}

function StatsCard({ title, value, icon, color, path }: StatsCardProps) {
    const router = useRouter();

    return (
        <Card
            sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                bgcolor: '#1a1a1a',
                color: '#fff',
                border: '1px solid #333',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(255,255,255,0.1)',
                    bgcolor: '#2a2a2a'
                }
            }}
            onClick={() => router.push(path)}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                        sx={{
                            bgcolor: color,
                            width: 56,
                            height: 56,
                            mr: 2
                        }}
                    >
                        {icon}
                    </Avatar>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff' }}>
                            {value}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#ccc' }}>
                            {title}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

export default function DashboardHome() {
    const router = useRouter();
    const { user } = useAuth();

    const statsData = [
        {
            title: 'Usuarios',
            value: '1,234',
            icon: <PeopleIcon />,
            color: '#1976d2',
            path: '/dashboard/userManagement'
        },
        {
            title: 'Autores',
            value: '567',
            icon: <PersonIcon />,
            color: '#388e3c',
            path: '/dashboard/authorManagement'
        },
        {
            title: 'Géneros',
            value: '89',
            icon: <CategoryIcon />,
            color: '#f57c00',
            path: '/dashboard/genresManagement'
        },
        {
            title: 'Tags',
            value: '234',
            icon: <TagIcon />,
            color: '#7b1fa2',
            path: '/dashboard/tagsManagement'
        },
        {
            title: 'Libros',
            value: '3,456',
            icon: <BookIcon />,
            color: '#d32f2f',
            path: '/dashboard/bookManagement'
        }
    ];

    const quickActions = [
        {
            title: 'Agregar Libro',
            description: 'Agregar un nuevo libro al catálogo',
            path: '/dashboard/bookManagement',
            color: '#d32f2f'
        },
        {
            title: 'Gestionar Usuarios',
            description: 'Administrar usuarios del sistema',
            path: '/dashboard/userManagement',
            color: '#1976d2'
        },
        {
            title: 'Crear Autor',
            description: 'Agregar un nuevo autor',
            path: '/dashboard/authorManagement',
            color: '#388e3c'
        },
        {
            title: 'Gestionar Géneros',
            description: 'Administrar géneros literarios',
            path: '/dashboard/genresManagement',
            color: '#f57c00'
        }
    ];

    return (
        <Box sx={{ p: 3, bgcolor: '#000', color: '#fff', minHeight: '100vh' }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff', mb: 1 }}>
                    📊 Dashboard de BookNet
                </Typography>
                <Typography variant="body1" sx={{ color: '#ccc', mb: 2 }}>
                    Bienvenido de vuelta, {user?.username || 'Admin'}. Aquí tienes un resumen de tu sistema.
                </Typography>
                <Chip
                    label={`Conectado como ${user?.role || 'Administrador'}`}
                    color="primary"
                    variant="outlined"
                />
            </Box>

            {/* Estadísticas */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#fff' }}>
                    📈 Estadísticas del Sistema
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    {statsData.map((stat, index) => (
                        <Box key={index} sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                            <StatsCard {...stat} />
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Acciones Rápidas */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#fff' }}>
                    ⚡ Acciones Rápidas
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    {quickActions.map((action, index) => (
                        <Box key={index} sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                            <Card
                                sx={{
                                    height: '100%',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    bgcolor: '#1a1a1a',
                                    color: '#fff',
                                    border: '1px solid #333',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 25px rgba(255,255,255,0.1)',
                                        bgcolor: '#2a2a2a'
                                    }
                                }}
                                onClick={() => router.push(action.path)}
                            >
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: action.color }}>
                                        {action.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#ccc', mb: 2 }}>
                                        {action.description}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        sx={{ 
                                            color: action.color, 
                                            borderColor: action.color,
                                            '&:hover': {
                                                bgcolor: `${action.color}20`,
                                                borderColor: action.color
                                            }
                                        }}
                                    >
                                        Ir →
                                    </Button>
                                </CardContent>
                            </Card>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Información del Sistema */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
                    <Paper sx={{ p: 3, height: '100%', bgcolor: '#1a1a1a', color: '#fff', border: '1px solid #333' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#fff' }}>
                            📊 Actividad Reciente
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ color: '#ccc', mb: 1 }}>
                                Libros agregados esta semana
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={75}
                                sx={{ height: 8, borderRadius: 4, mb: 1 }}
                            />
                            <Typography variant="caption" sx={{ color: '#999' }}>
                                75% del objetivo (45 de 60 libros)
                            </Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ color: '#ccc', mb: 1 }}>
                                Usuarios registrados este mes
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={60}
                                color="secondary"
                                sx={{ height: 8, borderRadius: 4, mb: 1 }}
                            />
                            <Typography variant="caption" sx={{ color: '#999' }}>
                                60% del objetivo (120 de 200 usuarios)
                            </Typography>
                        </Box>
                    </Paper>
                </Box>

                <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
                    <Paper sx={{ p: 3, height: '100%', bgcolor: '#1a1a1a', color: '#fff', border: '1px solid #333' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#fff' }}>
                            🎯 Estado del Sistema
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <AssessmentIcon sx={{ color: '#4caf50', mr: 1 }} />
                            <Typography variant="body2" sx={{ color: '#fff' }}>
                                Sistema funcionando correctamente
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <TrendingUpIcon sx={{ color: '#2196f3', mr: 1 }} />
                            <Typography variant="body2" sx={{ color: '#fff' }}>
                                Rendimiento óptimo
                            </Typography>
                        </Box>
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="body2" sx={{ color: '#ccc', mb: 1 }}>
                                Última actualización: Hace 5 minutos
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#999' }}>
                                Versión del sistema: v2.1.0
                            </Typography>
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
}
