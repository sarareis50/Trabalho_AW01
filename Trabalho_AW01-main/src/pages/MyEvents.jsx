import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../services/eventsService';
import { useAuth } from '../context/AuthContext';

export const MyEvents = () => {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getEvents().then(allEvents => {
        // Filtrar eventos criados pelo utilizador atual
        const filtered = allEvents.filter(e => e.organizerId === user.id);
        setMyEvents(filtered);
        setLoading(false);
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#f4fafa] flex items-center justify-center pt-28">
        <p className="text-teal-700 font-medium text-lg">A carregar os teus eventos...</p>
      </div>
    );
  }

  return (
    // pt-28 ou pt-32 dá o espaço exato abaixo da Navbar flutuante
    <div className="min-h-[85vh] bg-[#f4fafa] text-slate-800 pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Eventos Organizados por Mim</h1>
            <p className="text-slate-600 text-sm mt-1">Consulta e gere os eventos que criaste na plataforma.</p>
          </div>
          
          <Link 
            to="/events/new" 
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm rounded-xl transition-colors shadow-sm flex items-center gap-2"
          >
            + Criar Novo Evento
          </Link>
        </div>

        {/* Lista de Eventos */}
        {myEvents.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-lg mb-4">Ainda não criaste nenhum evento.</p>
            <Link 
              to="/events/new" 
              className="inline-block px-5 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-colors shadow-sm"
            >
              Criar o meu primeiro evento
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {myEvents.map(event => (
              <div 
                key={event.id} 
                className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                {/* Informações do Evento */}
                <div className="space-y-1.5">
                  <h3>
                    <Link 
                      to={`/events/${event.id}`} 
                      className="text-xl font-bold text-slate-900 hover:text-teal-600 transition-colors"
                    >
                      {event.title}
                    </Link>
                  </h3>
                  
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <span className="font-medium text-slate-700">Inscritos:</span> 
                    <span className="bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-md font-semibold text-xs">
                      {event.currentRegistrationsCount} / {event.capacity}
                    </span>
                  </p>
                  
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <span className="font-medium text-slate-700">Início:</span> 
                    {new Date(event.startsAt).toLocaleString('pt-PT')}
                  </p>
                </div>

                {/* Botões de Ação */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <Link 
                    to={`/events/${event.id}/edit`} 
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors shadow-sm"
                  >
                    Editar
                  </Link>
                  <Link 
                    to={`/events/${event.id}/registrations`} 
                    className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 text-sm font-medium rounded-xl transition-colors shadow-sm"
                  >
                    Inscritos
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};