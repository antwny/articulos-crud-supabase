export interface Articulo {
    id: number;
    created_at: string;
    nombre: string;
    precio: number;
}

export type ArticuloInput = Omit<Articulo, 'id' | 'created_at'>;
