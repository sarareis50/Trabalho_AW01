import React, { useRef } from 'react'

function SearchBar ({
    searchTerm,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    selectedDate,
    onDateChange,
    categories
    }) {

        const dateInputRef = useRef(null)

        const handleDateClick = () => {
            if(dateInputRef.current && typeof dateInputRef.current.showPicker === 'function') {
                dateInputRef.current.showPicker();
            }
        }

    return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
      
      <input
        type="text"
        placeholder="Pesquisar por título ou descrição..."
        value={searchTerm}
        onChange={onSearchChange}
        className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50 text-sm"
      />

      <select
        value={selectedCategory}
        onChange={onCategoryChange}
        className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50 text-sm text-slate-700"
      >
        <option value="">Todas as Categorias</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <input
        ref={dateInputRef}
        type="date"
        value={selectedDate}
        onChange={onDateChange}
        onClick={handleDateClick}
        className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50 text-sm text-slate-700"
      />
    </div>
  )
}

export default SearchBar