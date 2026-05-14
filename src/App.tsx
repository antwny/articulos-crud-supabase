import { useState } from 'react';
import { Package, Plus } from 'lucide-react';
import { useArticulos } from './hooks/useArticulos';
import { ArticuloList } from './components/ArticuloList';
import { ArticuloForm } from './components/ArticuloForm';
import type { Articulo } from './types';
import './index.css';

function App() {
  const { articulos, loading, error, addArticulo, updateArticulo, deleteArticulo } = useArticulos();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArticulo, setEditingArticulo] = useState<Articulo | null>(null);

  const handleOpenForm = (articulo?: Articulo) => {
    if (articulo) {
      setEditingArticulo(articulo);
    } else {
      setEditingArticulo(null);
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingArticulo(null);
  };

  const handleSubmit = async (input: any) => {
    if (editingArticulo) {
      return await updateArticulo(editingArticulo.id, input);
    } else {
      return await addArticulo(input);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-container">
            <div className="logo-icon-wrapper">
              <Package size={28} className="logo-icon" />
            </div>
            <h1>Gestión de Artículos</h1>
          </div>
          <button onClick={() => handleOpenForm()} className="btn btn-primary add-button">
            <Plus size={20} />
            <span>Nuevo Artículo</span>
          </button>
        </div>
      </header>

      <main className="main-content">
        {error && (
          <div className="alert error-alert">
            <p><strong>Error:</strong> {error}</p>
            <p className="alert-hint">Asegúrate de configurar tus credenciales de Supabase en el archivo `.env`.</p>
          </div>
        )}

        <ArticuloList
          articulos={articulos}
          loading={loading}
          onEdit={handleOpenForm}
          onDelete={deleteArticulo}
        />
      </main>

      {isFormOpen && (
        <ArticuloForm
          initialData={editingArticulo}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  );
}

export default App;
