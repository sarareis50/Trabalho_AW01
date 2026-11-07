import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getEvents, getRegistrations, cancelRegistration } from '../services/eventsService';
import { useAuth } from '../context/AuthContext';

export const MyRegistrations = () => {
  const { user } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadMyRegistrations = useCallback(async () => {
    // 1. Importas também a função getRegistrations do teu service
    const [allEvents, allRegistrations] = await Promise.all([
      getEvents(),
      getRegistrations() // <--- Precisas de ter esta função no eventsService.js
    ]);

    // 2. Filtra as inscrições do utilizador atual (usando conversão para string para evitar problemas de tipos)
    const userRegs = allRegistrations.filter(r => String(r.userId) === String(user.id));

    // 3. Descobre quais são os eventos correspondentes a essas inscrições
    const myEvents = allEvents.filter(event => 
      userRegs.some(r => String(r.eventId) === String(event.id))
    );

    return myEvents;
  }, [user]);

  useEffect(() => {
    if (!user) return;

    let active = true;
    loadMyRegistrations().then(myEvents => {
      if (active) {
        setRegisteredEvents(myEvents);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [user, loadMyRegistrations]);

  const handleCancel = async (eventId) => {
    try {
      await cancelRegistration(user.id, eventId);
      setMessage('Inscrição cancelada com sucesso.');
      setLoading(true);
      const myEvents = await loadMyRegistrations();
      setRegisteredEvents(myEvents);
      setLoading(false);
    } catch {
      setMessage('Erro ao cancelar a inscrição.');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>A carregar inscrições...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2>As Minhas Inscrições</h2>
      {message && <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '0.75rem', borderRadius: '4px', margin: '1rem 0' }}>{message}</div>}

      {registeredEvents.length === 0 ? (
        <p style={{ color: '#666', marginTop: '1rem' }}>Ainda não estás inscrito em nenhum evento. <Link to="/">Explorar eventos</Link></p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          {registeredEvents.map(event => (
            <div key={event.id} style={styles.card}>
              <div>
                <h3><Link to={`/events/${event.id}`} style={{ color: '#2c3e50', textDecoration: 'none' }}>{event.title}</Link></h3>
                <p style={{ color: '#555', margin: '0.3rem 0' }}><strong>Local:</strong> {event.location}</p>
                <p style={{ color: '#555', margin: '0.3rem 0' }}><strong>Data:</strong> {new Date(event.startsAt).toLocaleString('pt-PT')}</p>
              </div>
              <button onClick={() => handleCancel(event.id)} style={styles.cancelBtn}>Cancelar Inscrição</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  card: { background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' },
  cancelBtn: { background: '#e74c3c', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
};