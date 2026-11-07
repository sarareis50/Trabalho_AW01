import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEventById, addRegistration, cancelRegistration } from '../services/eventsService';
import { useAuth } from '../context/AuthContext';

export const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadEventDetails = async () => {
    try {
      const data = await getEventById(id);
      setEvent(data);
    } catch (err) {
      setError(err.message || 'Não foi possível carregar os detalhes do evento.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchEvent = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getEventById(id);
        if (isMounted) {
          setEvent(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Não foi possível carregar os detalhes do evento.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEvent();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>A carregar detalhes do evento...</div>;
  }

  if (!event) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Evento não encontrado</h2>
        <Link to="/">Voltar à página inicial</Link>
      </div>
    );
  }

  // Verificar se o utilizador atual já está inscrito
  const userRegistration = user 
    ? event.registrationsList.find((r) => r.userId === user.id) 
    : null;

  const isFull = event.currentRegistrationsCount >= event.capacity;
  const hasStarted = new Date(event.startsAt) < new Date();

  // Ações de Inscrição / Cancelamento
  const handleRegister = async () => {
    setError('');
    setSuccessMsg('');
    try {
      await addRegistration(user.id, event.id);
      setSuccessMsg('Inscrição efetuada com sucesso!');
      loadEventDetails(); // Recarregar dados para atualizar contadores e botões
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = async () => {
    setError('');
    setSuccessMsg('');
    try {
      await cancelRegistration(user.id, event.id);
      setSuccessMsg('Inscrição cancelada com sucesso!');
      loadEventDetails();
    } catch (err) {
      setError(err.message);
    }
  };

  const canEditOrDelete = user && (user.role === 'ADMIN' || user.id === event.organizerId);

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.backLink}>← Voltar aos Eventos</Link>

      <div style={styles.card}>
        <div style={styles.header}>
          <h1>{event.title}</h1>
          <span style={styles.categoryBadge}>{event.categoryName}</span>
        </div>

        <p style={styles.meta}><strong>Organizador:</strong> {event.organizerName}</p>
        <p style={styles.meta}><strong>Local:</strong> {event.location}</p>
        <p style={styles.meta}><strong>Início:</strong> {new Date(event.startsAt).toLocaleString('pt-PT')}</p>
        <p style={styles.meta}><strong>Fim:</strong> {new Date(event.endsAt).toLocaleString('pt-PT')}</p>
        <p style={styles.meta}>
          <strong>Capacidade:</strong> {event.currentRegistrationsCount} / {event.capacity} inscritos
          {isFull && <span style={styles.fullBadge}>Esgotado</span>}
        </p>

        <div style={styles.descriptionSection}>
          <h3>Descrição</h3>
          <p>{event.description}</p>
        </div>

        {/* Mensagens de Erro ou Sucesso das Regras de Negócio */}
        {error && <div style={styles.errorBox}>{error}</div>}
        {successMsg && <div style={styles.successBox}>{successMsg}</div>}

        {/* Secção de Inscrições / Ações */}
        <div style={styles.actionSection}>
          {!user ? (
            <p>Tens de <Link to="/login">iniciar sessão</Link> para te inscreveres neste evento.</p>
          ) : hasStarted ? (
            <p style={styles.warningText}>Este evento já começou. Não são permitidas novas inscrições nem cancelamentos.</p>
          ) : userRegistration ? (
            <div>
              <p style={{ color: '#27ae60', marginBottom: '1rem' }}>✓ Já estás inscrito neste evento.</p>
              <button onClick={handleCancel} style={styles.cancelBtn}>Cancelar Inscrição</button>
            </div>
          ) : isFull ? (
            <p style={{ color: '#e74c3c' }}>Este evento atingiu a capacidade máxima[cite: 2].</p>
          ) : (
            <button onClick={handleRegister} style={styles.registerBtn}>Inscrever-me</button>
          )}
        </div>

        {/* Opções de Organizador / Admin */}
        {canEditOrDelete && (
          <div style={styles.adminActions}>
            <h4>Área de Gestão do Evento</h4>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <Link to={`/events/${event.id}/edit`} style={styles.editBtn}>Editar Evento</Link>
              <Link to={`/events/${event.id}/registrations`} style={styles.viewRegsBtn}>Ver Lista de Inscritos</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '800px', margin: '0 auto' },
  backLink: { display: 'inline-block', marginBottom: '1rem', textDecoration: 'none', color: '#3498db' },
  card: { background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' },
  categoryBadge: { background: '#e1f5fe', color: '#0288d1', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold' },
  meta: { margin: '0.4rem 0', color: '#555' },
  fullBadge: { background: '#ffebee', color: '#c62828', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', marginLeft: '0.5rem' },
  descriptionSection: { marginTop: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1rem' },
  actionSection: { marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' },
  registerBtn: { background: '#27ae60', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' },
  cancelBtn: { background: '#e74c3c', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' },
  errorBox: { background: '#ffebee', color: '#c62828', padding: '0.75rem', borderRadius: '4px', marginTop: '1rem' },
  successBox: { background: '#e8f5e9', color: '#2e7d32', padding: '0.75rem', borderRadius: '4px', marginTop: '1rem' },
  warningText: { color: '#e67e22', fontStyle: 'italic' },
  adminActions: { marginTop: '2rem', borderTop: '2px dashed #eee', paddingTop: '1.5rem' },
  editBtn: { background: '#f39c12', color: '#fff', padding: '0.5rem 1rem', borderRadius: '4px', textDecoration: 'none', fontSize: '0.9rem' },
  viewRegsBtn: { background: '#34495e', color: '#fff', padding: '0.5rem 1rem', borderRadius: '4px', textDecoration: 'none', fontSize: '0.9rem' }
};