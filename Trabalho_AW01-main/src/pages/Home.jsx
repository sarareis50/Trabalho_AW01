import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getEvents, getCategories } from '../services/eventsService'
import EventCard from '../components/EventCard'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'

export const Home = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para Filtros e Pesquisa
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Estado para Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [eventsData, categoriesData] = await Promise.all([
        getEvents(),
        getCategories(),
      ]);
      setEvents(eventsData);
      setCategories(categoriesData);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filtragem dos eventos
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? event.categoryId === Number(selectedCategory) : true;
    const matchesDate = selectedDate ? event.startsAt.startsWith(selectedDate) : true;
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  // Cálculo da Paginação
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4fafa] flex items-center justify-center">
        <p className="text-teal-700 font-medium text-lg">A carregar eventos académicos...</p>
      </div>
    );
  }

  return (
    // Fundo geral suave
    <div className="min-h-screen bg-[#f4fafa] text-slate-800 pb-20">
      
      {/* Secção Hero Centrada */}
      <section className="max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
        
        {/* Pílula de destaque centrada */}
        <div className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200/80 p-1 pl-3 pr-4 rounded-full shadow-sm mb-8 mx-auto">
          <span className="bg-teal-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            IPVC Eventos
          </span>
          <span className="text-sm font-medium text-slate-600 flex items-center gap-1">
            Plataforma Académica Ativa <span className="text-teal-600 font-bold">→</span>
          </span>
        </div>

        {/* Título Principal */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
          Transforme a sua <span className="text-teal-600">Vida Académica</span> numa Experiência Inesquecível
        </h1>

        {/* Subtítulo */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Explore conferências, workshops e palestras exclusivas no Instituto Politécnico de Viana do Castelo. Organize, participe e colabore sem complicações.
        </p>
      </section>

      {/* Contentor Principal dos Eventos (Limitado e Centrado) */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          selectedCategory={selectedCategory}
          onCategoryChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
          selectedDate={selectedDate}
          onDateChange={(e) => { setSelectedDate(e.target.value); setCurrentPage(1); }}
          categories={categories}
        />  

        <h2 className="text-2xl font-bold text-slate-900 mb-6 px-1">Próximos Eventos em Destaque</h2>

        {currentEvents.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-lg">Nenhum evento encontrado com os filtros selecionados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentEvents.map((event) => {
              // 1. Encontra a categoria correspondente a este evento
              const category = categories.find((cat) => cat.id === event.categoryId);

              return (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  description={event.description}
                  location={event.location}
                  startsAt={event.startsAt}
                  endsAt={event.endsAt}
                  capacity={event.capacity}
                  categoryName={category ? category.name : 'Geral'}
                  // Podes passar aqui a função de inscrição se já a tiveres criada na Home
                  onRegister={(id) => console.log('Inscrever no evento:', id)}
                />
              );
            })}
          </div>
        )}

        {/* Paginação */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
};