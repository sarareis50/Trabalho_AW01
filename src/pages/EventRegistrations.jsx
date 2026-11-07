import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEventById, cancelRegistration } from '../services/eventsService';

export const EventRegistrations = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadEventData = async () => {
    setLoading(true);
    const data = await getEventById(id);
    setEvent(data);
    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    const loadEvent = async () => {
      setLoading(true);

      try {
        const data = await getEventById(id);

        if (isMounted) {
          setEvent(data);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadEvent();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleRemoveRegistration = async (userId) => {
    try {
      await cancelRegistration(userId, event.id);
      setMessage('Inscrição removida com sucesso.');
      loadEventData();
    } catch {
      setMessage('Erro ao remover a inscrição.');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>A carregar lista de inscritos...</div>;
  if (!event) return <div style={{ textAlign: 'center', padding: '2rem' }}>Evento não encontrado.</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link to={`/events/${event.id}`} style={{ color: '#3498db', textDecoration: 'none' }}>← Voltar aos Detalhes do Evento</Link>
      <h2 style={{ marginTop: '1rem' }}>Inscritos em: {event.title}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>Total: {event.currentRegistrationsCount} / {event.capacity} lugares preenchidos</p>

      {message && <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>{message}</div>}

      {!event.registrationsList || event.registrationsList.length === 0 ? (
        <p style={{ color: '#666' }}>Ainda não existem utilizadores inscritos neste evento.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr style={styles.thTr}>
              <th style={styles.th}>ID Utilizador</th>
              <th style={styles.th}>Data da Inscrição</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {event.registrationsList.map((reg, index) => (
              <tr key={index} style={styles.tdTr}>
                <td style={styles.td}>Utilizador #{reg.userId}</td>
                <td style={styles.td}>{new Date(reg.registeredAt).toLocaleString('pt-PT')}</td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  <button onClick={() => handleRemoveRegistration(reg.userId)} style={styles.removeBtn}>
                    Remover Inscrição
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' },
  thTr: { background: '#f8f9fa', borderBottom: '2px solid #dee2e6' },
  th: { padding: '0.75rem 1rem', textAlign: 'left', color: '#333', fontSize: '0.9rem' },
  tdTr: { borderBottom: '1px solid #eee' },
  td: { padding: '0.75rem 1rem', color: '#555', fontSize: '0.95rem' },
  removeBtn: { background: '#e74c3c', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }
};