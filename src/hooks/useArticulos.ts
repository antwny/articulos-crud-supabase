import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Articulo, ArticuloInput } from '../types';

export function useArticulos() {
    const [articulos, setArticulos] = useState<Articulo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchArticulos = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('articulos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setArticulos(data || []);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Error fetching articulos');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchArticulos();
    }, [fetchArticulos]);

    const addArticulo = async (input: ArticuloInput) => {
        try {
            const { data, error } = await supabase
                .from('articulos')
                .insert([input])
                .select()
                .single();

            if (error) throw error;
            setArticulos(prev => [data, ...prev]);
            return { data, error: null };
        } catch (err: any) {
            return { data: null, error: err.message };
        }
    };

    const updateArticulo = async (id: number, input: ArticuloInput) => {
        try {
            const { data, error } = await supabase
                .from('articulos')
                .update(input)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            setArticulos(prev => prev.map(art => art.id === id ? data : art));
            return { data, error: null };
        } catch (err: any) {
            return { data: null, error: err.message };
        }
    };

    const deleteArticulo = async (id: number) => {
        try {
            const { error } = await supabase
                .from('articulos')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setArticulos(prev => prev.filter(art => art.id !== id));
            return { error: null };
        } catch (err: any) {
            return { error: err.message };
        }
    };

    return {
        articulos,
        loading,
        error,
        addArticulo,
        updateArticulo,
        deleteArticulo,
        refresh: fetchArticulos
    };
}
