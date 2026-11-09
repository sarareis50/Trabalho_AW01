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
    return (
      <div className="min-h-screen bg-[#f4fafa] flex items-center justify-center">
        <p className="text-teal-700 font-medium text-lg">A carregar detalhes do evento...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#f4fafa] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Evento não encontrado</h2>
        <Link to="/" className="text-teal-600 hover:underline font-medium">
          Voltar à página inicial
        </Link>
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
      loadEventDetails();
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
    <div className="min-h-screen bg-[#f4fafa] text-slate-800 pb-20 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Link Voltar */}
        <Link to="/" className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 font-medium mb-6 transition-colors">
          <span>←</span> Voltar aos Eventos
        </Link>

        {/* Cartão Principal */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
          
          {/* Cabeçalho */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{event.title}</h1>
            <span className="self-start sm:self-auto bg-teal-50 text-teal-700 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-teal-100">
              {event.categoryName}
            </span>
          </div>

          {/* Metadados / Informações */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 text-sm text-slate-600">
            <p><strong className="text-slate-900">Organizador:</strong> {event.organizerName}</p>
            <p><strong className="text-slate-900">Local:</strong> {event.location}</p>
            <p><strong className="text-slate-900">Início:</strong> {new Date(event.startsAt).toLocaleString('pt-PT')}</p>
            <p><strong className="text-slate-900">Fim:</strong> {new Date(event.endsAt).toLocaleString('pt-PT')}</p>
            <p className="sm:col-span-2 flex items-center gap-2">
              <strong className="text-slate-900">Capacidade:</strong> {event.currentRegistrationsCount} / {event.capacity} inscritos
              {isFull && (
                <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-md text-xs font-semibold">
                  Esgotado
                </span>
              )}
            </p>
          </div>

          {/* Secção da Descrição */}
          <div className="border-t border-slate-100 pt-6 mt-2">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Descrição</h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{event.description}</p>
          </div>

          {/* Mensagens de Erro ou Sucesso */}
          {error && (
            <div className="mt-6 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="mt-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">
              {successMsg}
            </div>
          )}

          {/* Secção de Inscrições / Ações */}
          <div className="border-t border-slate-100 pt-6 mt-6">
            {!user ? (
              <p className="text-sm text-slate-600">
                Tens de <Link to="/login" className="text-teal-600 font-semibold hover:underline">iniciar sessão</Link> para te inscreveres neste evento.
              </p>
            ) : hasStarted ? (
              <p className="text-amber-600 italic text-sm">
                Este evento já começou. Não são permitidas novas inscrições nem cancelamentos.
              </p>
            ) : userRegistration ? (
              <div>
                <p className="text-emerald-600 font-medium text-sm mb-4">✓ Já estás inscrito neste evento.</p>
                <button 
                  onClick={handleCancel} 
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
                >
                  Cancelar Inscrição
                </button>
              </div>
            ) : isFull ? (
              <p className="text-rose-600 font-medium text-sm">Este evento atingiu a capacidade máxima.</p>
            ) : (
              <button 
                onClick={handleRegister} 
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
              >
                Inscrever-me
              </button>
            )}
          </div>

          {/* Opções de Organizador / Admin */}
          {canEditOrDelete && (
            <div className="border-t border-dashed border-slate-200 pt-6 mt-8">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Área de Gestão do Evento</h4>
              <div className="flex flex-wrap gap-3">
                <Link 
                  to={`/events/${event.id}/edit`} 
                  className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-sm"
                >
                  Editar Evento
                </Link>
                <Link 
                  to={`/events/${event.id}/registrations`} 
                  className="bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-sm"
                >
                  Ver Lista de Inscritos
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};