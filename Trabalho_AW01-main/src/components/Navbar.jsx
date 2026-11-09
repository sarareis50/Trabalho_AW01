import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    // w-full garante que ocupa a largura total, com um padding lateral seguro (px-4)
    <header className="sticky top-6 z-50 w-full px-4 sm:px-8">
      {/* Barra interior com largura total máxima esticada e cantos arredondados modernos */}
      <nav className="max-w-7xl mx-auto bg-white border border-slate-100 shadow-sm rounded-2xl px-6 sm:px-10 py-4 flex items-center justify-between">
        
        {/* Logótipo */}
        <div className="flex items-center">
          <Link 
            to="/" 
            className="text-xl sm:text-2xl font-semibold tracking-tight text-teal-600 flex items-center gap-2.5 hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            <span>ESTG Eventos</span>
          </Link>
        </div>

        {/* Links de Navegação */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link 
            to="/" 
            className="text-[15px] font-medium text-slate-700 hover:text-teal-600 transition-colors hidden md:block"
          >
            Eventos
          </Link>

          {user ? (
          <div className="flex items-center gap-5">
            {/* Visíveis em todos os ecrãs */}
            <Link 
              to="/events/new" 
              className="text-sm font-medium text-slate-700 hover:text-teal-600 transition-colors"
            >
              + Criar Evento
            </Link>
            
            <Link 
              to="/me/registrations" 
              className="text-sm font-medium text-slate-700 hover:text-teal-600 transition-colors"
            >
              Minhas Inscrições
            </Link>
            
            <Link 
              to="/me/events" 
              className="text-sm font-medium text-slate-700 hover:text-teal-600 transition-colors"
            >
              Meus Eventos
            </Link>

            {user.role === 'ADMIN' && (
              <Link 
                to="/admin/categories" 
                className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-md border border-red-100 uppercase tracking-wider"
              >
                Gestão Categorias
              </Link>
            )}

            {/* Informação do Utilizador & Botão Sair */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <span className="text-sm text-slate-600 hidden xl:inline">
                Olá, <strong className="text-slate-800">{user.name}</strong>
              </span>
              
              <button 
                onClick={handleLogout} 
                className="px-3.5 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        ) : (
            <div className="flex items-center gap-4 sm:gap-6">
              <Link 
                to="/login" 
                className="text-[15px] font-medium text-slate-700 hover:text-teal-600 transition-colors"
              >
                Entrar
              </Link>
              
              <Link 
                to="/register" 
                className="px-6 py-2.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors shadow-sm whitespace-nowrap"
              >
                Criar Conta
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};