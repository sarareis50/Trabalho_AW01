import { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/eventsService';
import { useAuth } from '../context/AuthContext';

export const AdminCategories = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [message, setMessage] = useState('');
  
  // Estados para controlar a edição
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const loadData = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      setMessage('Erro ao carregar categorias.');
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadInitialData = async () => {
      try {
        const data = await getCategories();
        if (!cancelled) setCategories(data);
      } catch {
        if (!cancelled) setMessage('Erro ao carregar categorias.');
      }
    };

    loadInitialData();
    return () => {
      cancelled = true;
    };
  }, []);

  // Criar Categoria
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      await createCategory({ name: newCategoryName });
      setNewCategoryName('');
      setMessage('Categoria criada com sucesso!');
      loadData();
    } catch {
      setMessage('Erro ao criar categoria.');
    }
  };

  // Iniciar Edição
  const startEditing = (cat) => {
    setEditingId(cat.id);
    setEditingName(typeof cat.name === 'object' && cat.name !== null ? cat.name.name : cat.name);
    setMessage('');
  };

  // Guardar Edição
  const handleUpdate = async (id) => {
    if (!editingName.trim()) return;

    try {
      await updateCategory(id, { name: editingName });
      setEditingId(null);
      setEditingName('');
      setMessage('Categoria atualizada com sucesso!');
      loadData();
    } catch {
      setMessage('Erro ao atualizar categoria.');
    }
  };

  // Eliminar Categoria (com validação de eventos associados simulada no backend/serviço)
  const handleDelete = async (id) => {
    if (!window.confirm('Tens a certeza que pretendes eliminar esta categoria?')) return;

    try {
      await deleteCategory(id);
      setMessage('Categoria eliminada com sucesso!');
      loadData();
    } catch (error) {
      // Se o backend bloquear por ter eventos associados, apanha o erro aqui
      setMessage(error.response?.data?.message || 'Erro ao eliminar: Certifica-te de que a categoria não tem eventos associados.');
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return <div style={{ textAlign: 'center', padding: '3rem' }}><h2>Acesso Restrito</h2><p>Apenas administradores podem aceder a esta página.</p></div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h2>Gestão de Categorias</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>Criar, editar e gerir categorias de eventos académicos.</p>

      {message && <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>{message}</div>}

      {/* Formulário de Criação */}
      <form onSubmit={handleCreate} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Nome da nova categoria..."
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.btnCreate}>Adicionar</button>
      </form>

      {/* Listagem de Categorias */}
      <div style={styles.cardList}>
        {categories.map(cat => {
          const categoryName = typeof cat.name === 'object' && cat.name !== null ? cat.name.name : cat.name;
          const isEditing = editingId === cat.id;

          return (
            <div key={cat.id} style={styles.cardItem}>
              {isEditing ? (
                // Modo de Edição
                <div style={{ display: 'flex', gap: '0.5rem', flex: 1, marginRight: '1rem' }}>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    style={styles.input}
                  />
                  <button onClick={() => handleUpdate(cat.id)} style={styles.btnSave}>Salvar</button>
                  <button onClick={() => setEditingId(null)} style={styles.btnCancel}>Cancelar</button>
                </div>
              ) : (
                // Modo Normal (Visualização)
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <div>
                    <span style={{ fontWeight: 'bold' }}>{categoryName}</span>
                    <span style={{ fontSize: '0.8rem', color: '#888', marginLeft: '1rem' }}>ID: {cat.id}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => startEditing(cat)} style={styles.btnEdit}>Editar</button>
                    <button onClick={() => handleDelete(cat.id)} style={styles.btnDelete}>Eliminar</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  input: { flex: 1, padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' },
  btnCreate: { background: '#27ae60', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
  btnEdit: { background: '#f39c12', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' },
  btnDelete: { background: '#e74c3c', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' },
  btnSave: { background: '#2980b9', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' },
  btnCancel: { background: '#95a5a6', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' },
  cardList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  cardItem: { background: '#fff', border: '1px solid #e0e0e0', padding: '1rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
};