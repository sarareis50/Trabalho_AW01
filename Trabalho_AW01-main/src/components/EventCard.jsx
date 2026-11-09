import React from 'react';
import { Link } from 'react-router-dom';

function EventCard({ 
  id, 
  title, 
  description, 
  location, 
  startsAt, 
  endsAt, 
  capacity, 
  categoryName, 
  organizerName, 
  onRegister 
}) {
  const soldOut = capacity === 0;

  return (
    <article className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Título do Evento */}
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
          {title}
        </h3>

        {/* Badge de Categoria e Esgotado */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
             {categoryName || 'Geral'}
          </span>
          {soldOut && (
            <span className="text-xs font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-md">
              Esgotado
            </span>
          )}
        </div>

        {/* Data e Hora de Início */}
        <p className="text-xs font-medium text-slate-500 mb-2">
           {new Date(startsAt).toLocaleString('pt-PT', { dateStyle: 'medium', timeStyle: 'short' })}
        </p>

        {/* Localização */}
        <p className="text-sm text-slate-500 mb-3 flex items-center gap-1.5">
           {location}
        </p>

        {/* Descrição resumida */}
        <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">
          {description}
        </p>
      </div>
      
      {/* Botões de Ação (Ver Detalhes e Inscrição) */}
      <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
        <Link 
          to={`/events/${id}`} 
          className="flex-1 text-center py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors text-sm"
        >
          Detalhes
        </Link>

        <button 
          onClick={() => onRegister(id)} 
          disabled={soldOut}
          className={`flex-1 py-2.5 px-4 font-medium rounded-xl transition-colors text-sm shadow-sm ${
            soldOut 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
              : 'bg-teal-600 hover:bg-teal-700 text-white'
          }`}
        >
          {soldOut ? 'Sem lugares' : 'Inscrever'}
        </button>
      </div>
    </article>
  );
}

export default EventCard;