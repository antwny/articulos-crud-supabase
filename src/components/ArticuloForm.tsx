import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import type { Articulo, ArticuloInput } from '../types';

interface ArticuloFormProps {
    initialData?: Articulo | null;
    onSubmit: (data: ArticuloInput) => Promise<{ error: string | null }>;
    onCancel: () => void;
}

export function ArticuloForm({ initialData, onSubmit, onCancel }: ArticuloFormProps) {
    const [nombre, setNombre] = useState(initialData?.nombre || '');
    const [precio, setPrecio] = useState(initialData?.precio?.toString() || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (initialData) {
            setNombre(initialData.nombre);
            setPrecio(initialData.precio.toString());
        } else {
            setNombre('');
            setPrecio('');
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre.trim() || !precio) {
            setErrorMsg('Por favor completa todos los campos.');
            return;
        }

        setIsSubmitting(true);
        setErrorMsg('');
        const { error } = await onSubmit({
            nombre,
            precio: parseFloat(precio)
        });

        if (error) {
            setErrorMsg(error);
            setIsSubmitting(false);
        } else {
            setIsSubmitting(false);
            onCancel();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{initialData ? 'Editar Artículo' : 'Nuevo Artículo'}</h2>
                    <button type="button" onClick={onCancel} className="icon-button" aria-label="Cerrar">
                        <X size={20} />
                    </button>
                </div>

                {errorMsg && <div className="error-message">{errorMsg}</div>}

                <form onSubmit={handleSubmit} className="articulo-form">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre del artículo</label>
                        <input
                            id="nombre"
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej. Teclado Mecánico"
                            className="text-input"
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="precio">Precio</label>
                        <div className="input-with-icon">
                            <span className="currency-symbol">$</span>
                            <input
                                id="precio"
                                type="number"
                                step="0.01"
                                min="0"
                                value={precio}
                                onChange={(e) => setPrecio(e.target.value)}
                                placeholder="0.00"
                                className="text-input price-input"
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={isSubmitting}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <span className="loading-spinner small"></span>
                            ) : (
                                <>
                                    <Save size={18} />
                                    <span>Guardar</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
