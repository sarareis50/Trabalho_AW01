import { useState } from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#f4fafa] pt-16 pb-12 border-t border-slate-200/60 text-slate-600">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Secção Principal: 3 Colunas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 pb-12">
          
          {/* Coluna 1: Sobre a Plataforma */}
          <div>
            <h3 className="text-slate-900 font-bold tracking-wider text-sm uppercase mb-4">
              EVENTOS IPVC
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Plataforma oficial para consulta, inscrição e organização de conferências, workshops e eventos académicos no Instituto Politécnico de Viana do Castelo.
            </p>
          </div>

          {/* Coluna 2: Contactos */}
          <div>
            <h3 className="text-slate-900 font-bold tracking-wider text-sm mb-4">
              Contactos
            </h3>
            <div className="space-y-2.5 text-sm">
              <p className="text-slate-700 font-medium">Escola Superior de Tecnologia e Gestão</p>
              <p className="text-slate-500">Viana do Castelo, Portugal</p>
              
              <div className="pt-2 space-y-2.5">
                <p className="flex items-center gap-2.5 text-slate-600">
                  <span className="w-4 h-4 flex items-center justify-center text-teal-600 font-bold">📞</span>
                  +351 258 809 600
                </p>
                
                <p className="flex items-center gap-2.5 text-slate-600">
                  <img 
                    src="/src/assets/email.png" 
                    alt="Email" 
                    className="w-4 h-4 object-contain" 
                  /> 
                  <a href="mailto:eventos@ipvc.pt" className="hover:text-teal-600 transition-colors">
                    eventos@ipvc.pt
                  </a>
                </p>

                <p className="flex items-center gap-2.5 text-slate-600">
                  <img 
                    src="/src/assets/website.png" 
                    alt="Website" 
                    className="w-4 h-4 object-contain" 
                  /> 
                  <a href="https://www.ipvc.pt" target="_blank" rel="noreferrer" className="hover:text-teal-600 transition-colors">
                    www.ipvc.pt
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Coluna 3: Subscrição / Newsletter (Mais informação) */}
          <div>
            <h3 className="text-slate-900 font-bold text-sm mb-4">
              Mais informação?
            </h3>
            
            {/* Caixa para mais informações */}
            <div className="bg-[#d5f2ec]/60 p-2 rounded-2xl mb-3">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  type="email"
                  placeholder="Introduza o seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-sm bg-white rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-white hover:bg-slate-50 text-teal-700 font-medium text-sm rounded-xl transition-colors shadow-sm whitespace-nowrap"
                >
                  Submeter
                </button>
              </form>
            </div>

            {subscribed ? (
              <p className="text-xs text-teal-700 font-medium">Obrigado por se subscrever! Entraremos em contacto.</p>
            ) : (
              <p className="text-xs text-slate-500 leading-normal">
                Receba todas as novidades dos eventos académicos no seu email. Prometemos não enviar spam.
              </p>
            )}
          </div>

        </div>

        {/* Linha Divisória de Fundo */}
        <div className="border-t border-slate-200/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Eventos IPVC. Desenvolvido no âmbito curricular ESTG/IPVC.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-teal-600 transition-colors">Início</Link>
            <span>•</span>
            <Link to="/login" className="hover:text-teal-600 transition-colors">Área Reservada</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};