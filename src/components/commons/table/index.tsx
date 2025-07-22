'use client';

import { ReactNode } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    CircularProgress,
    Alert,
    Box
} from '@mui/material';

// Definición de tipos para las columnas
export interface TableColumn<T = Record<string, unknown>> {
    id: string;
    label: string;
    minWidth?: number;
    align?: 'right' | 'left' | 'center';
    format?: (value: unknown, row: T, index: number) => ReactNode;
}

// Props del componente de tabla
interface CommonTableProps<T = Record<string, unknown>> {
    columns: TableColumn<T>[];
    data: T[];
    loading: boolean;
    error: string | null;
    totalCount: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: unknown, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    rowsPerPageOptions?: number[];
    getRowKey: (row: T, index: number) => string | number;
    onRowClick?: (row: T) => void;
    emptyMessage?: string;
    loadingMessage?: string;
}

function CommonTable<T = Record<string, unknown>>({
    columns,
    data,
    loading,
    error,
    totalCount,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    rowsPerPageOptions = [5, 10, 25],
    getRowKey,
    onRowClick,
    emptyMessage = 'No hay datos disponibles',
}: CommonTableProps<T>) {
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress sx={{ color: '#60a5fa' }} />
            </Box>
        );
    }

    return (
        <>
            {error && (
                <Alert 
                    severity="error" 
                    sx={{ 
                        mb: 2,
                        bgcolor: '#7f1d1d',
                        color: '#fecaca',
                        '& .MuiAlert-icon': {
                            color: '#ef4444'
                        }
                    }}
                >
                    {error}
                </Alert>
            )}

            <TableContainer 
                component={Paper} 
                sx={{ 
                    backgroundColor: '#1a1a1a',
                    borderRadius: 2,
                    border: '1px solid #333',
                    '& .MuiTableCell-root': {
                        borderColor: '#333',
                        color: '#fff'
                    }
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#2d2d2d' }}>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                    sx={{ 
                                        color: '#60a5fa', 
                                        fontWeight: 'bold', 
                                        fontSize: '0.875rem' 
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell 
                                    colSpan={columns.length} 
                                    sx={{ 
                                        textAlign: 'center', 
                                        py: 4, 
                                        color: '#9ca3af' 
                                    }}
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row, index) => (
                                <TableRow 
                                    key={getRowKey(row, index)}
                                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                                    sx={{ 
                                        '&:hover': { 
                                            backgroundColor: '#2d2d2d',
                                            transition: 'background-color 0.2s ease',
                                            cursor: onRowClick ? 'pointer' : 'default'
                                        },
                                        '&:nth-of-type(even)': {
                                            backgroundColor: '#262626'
                                        }
                                    }}
                                >
                                    {columns.map((column) => (
                                        <TableCell 
                                            key={`${index}-${column.id}`} 
                                            align={column.align}
                                            sx={{ 
                                                color: '#e5e7eb', 
                                                fontSize: '0.875rem' 
                                            }}
                                        >
                                            {column.format 
                                                ? column.format((row as Record<string, unknown>)[column.id], row, index)
                                                : String((row as Record<string, unknown>)[column.id] ?? '')
                                            }
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={rowsPerPageOptions}
                    component="div"
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                    labelRowsPerPage="Filas por página:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
                    sx={{
                        color: '#e5e7eb',
                        bgcolor: '#1a1a1a',
                        borderTop: '1px solid #333',
                        '& .MuiTablePagination-selectIcon': {
                            color: '#60a5fa'
                        },
                        '& .MuiTablePagination-select': {
                            color: '#e5e7eb',
                            bgcolor: '#2d2d2d',
                            '&:hover': {
                                bgcolor: '#374151'
                            }
                        },
                        '& .MuiTablePagination-displayedRows': {
                            color: '#9ca3af',
                            fontSize: '0.875rem'
                        },
                        '& .MuiTablePagination-actions': {
                            '& .MuiIconButton-root': {
                                color: '#60a5fa',
                                '&:hover': {
                                    backgroundColor: 'rgba(96, 165, 250, 0.1)'
                                },
                                '&.Mui-disabled': {
                                    color: '#4b5563'
                                }
                            }
                        }
                    }}
                />
            </TableContainer>
        </>
    );
}

export default CommonTable;
export type { CommonTableProps };