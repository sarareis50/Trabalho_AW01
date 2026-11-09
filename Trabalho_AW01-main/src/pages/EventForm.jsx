import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEventById, createEvent, updateEvent, deleteEvent, getCategories } from '../services/eventsService';
import { useAuth } from '../context/AuthContext';

export const EventForm = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [capacity, setCapacity] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getCategories().then(setCategories);
    if (isEdit && id) {
      getEventById(id).then((event) => {
        if (event) {
          setTitle(event.title);
          setDescription(event.description);
          setLocation(event.location);
          setStartsAt(event.startsAt);
          setEndsAt(event.endsAt);
          setCapacity(event.capacity);
          setCategoryId(event.categoryId);
        }
      });
    }
  }, [isEdit, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validação da regra de negócio: Data de fim posterior à de início[cite: 2]
    if (new Date(endsAt) <= new Date(startsAt)) {
      setError('A data de fim tem de ser posterior à data de início.');
      return;
    }

    try {
      const eventData = {
        title,
        description,
        location,
        startsAt,
        endsAt,
        capacity: Number(capacity),
        categoryId: Number(categoryId),
      };

      if (isEdit) {
        await updateEvent(id, eventData);
      } else {
        await createEvent(eventData, user.id);
      }

      navigate('/');
    } catch {
      setError('Erro ao guardar o evento.');
    }
  };

  // Função para eliminar o evento
  const handleDelete = async () => {
    if (!window.confirm('Tens a certeza que pretendes eliminar este evento?')) return;

    try {
      await deleteEvent(id);
      navigate('/');
    } catch {
      setError('Erro ao eliminar o evento.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', padding: '2rem', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
      <h2>{isEdit ? 'Editar Evento' : 'Criar Novo Evento'}</h2>
      {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '0.75rem', borderRadius: '4px', margin: '1rem 0' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label>Título:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={styles.input} required />
        </div>
        <div>
          <label>Categoria:</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={styles.input} required>
            <option value="">Selecione uma categoria</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label>Local:</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} style={styles.input} required />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label>Início:</label>
            <input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} style={styles.input} required />
          </div>
          <div style={{ flex: 1 }}>
            <label>Fim:</label>
            <input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} style={styles.input} required />
          </div>
        </div>
        <div>
          <label>Capacidade:</label>
          <input type="number" min="1" value={capacity} onChange={(e) => setCapacity(e.target.value)} style={styles.input} required />
        </div>
        <div>
          <label>Descrição:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...styles.input, height: '100px' }} required />
        </div>

        {/* Botões de Ação */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="submit" style={{ ...styles.btn, flex: 1, background: '#27ae60' }}>
            {isEdit ? 'Guardar Alterações' : 'Criar Evento'}
          </button>

          {/* Botão de Eliminar visível apenas no modo de edição */}
          {isEdit && (
            <button type="button" onClick={handleDelete} style={{ ...styles.btn, background: '#e74c3c' }}>
              Eliminar Evento
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

const styles = {
  input: { width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc', marginTop: '0.3rem' },
  btn: { padding: '0.75rem', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }
};