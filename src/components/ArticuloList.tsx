import { Edit2, Trash2, Calendar, Tag } from 'lucide-react';
import type { Articulo } from '../types';

interface ArticuloListProps {
    articulos: Articulo[];
    loading: boolean;
    onEdit: (articulo: Articulo) => void;
    onDelete: (id: number) => void;
}

export function ArticuloList({ articulos, loading, onEdit, onDelete }: ArticuloListProps) {
    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Cargando artículos...</p>
            </div>
        );
    }

    if (articulos.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon-wrapper">
                    <Tag size={48} opacity={0.5} />
                </div>
                <h3>No hay artículos</h3>
                <p>Comienza agregando tu primer artículo a la base de datos.</p>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(price);
    };

    return (
        <div className="grid">
            {articulos.map((articulo) => (
                <div key={articulo.id} className="card">
                    <div className="card-header">
                        <h3 className="card-title">{articulo.nombre}</h3>
                        <div className="card-price">{formatPrice(articulo.precio)}</div>
                    </div>

                    <div className="card-body">
                        <div className="meta-info">
                            <Calendar size={14} />
                            <span>{formatDate(articulo.created_at)}</span>
                        </div>
                        <div className="meta-info">
                            <span className="id-badge">ID: {articulo.id}</span>
                        </div>
                    </div>

                    <div className="card-footer">
                        <button
                            onClick={() => onEdit(articulo)}
                            className="action-btn edit-btn"
                            title="Editar"
                        >
                            <Edit2 size={16} />
                            <span>Editar</span>
                        </button>
                        <button
                            onClick={() => {
                                if (window.confirm(`¿Estás seguro de eliminar "${articulo.nombre}"?`)) {
                                    onDelete(articulo.id);
                                }
                            }}
                            className="action-btn delete-btn"
                            title="Eliminar"
                        >
                            <Trash2 size={16} />
                            <span>Eliminar</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
