import React from 'react'

function Pagination ({
    currentPage,
    totalPages,
    onPageChange
}){
        if (totalPages <= 1) return (null)

        return (
            <div className="flex justify-center items-center gap-2 mt-12">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl font-medium text-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    Anterior
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-10 h-10 rounded-xl font-medium text-sm transition-colors flex items-center justify-center ${
                        page === currentPage 
                        ? 'bg-teal-600 text-white shadow-sm' 
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                    >
                    {page}
                    </button>
                ))}

                {/* Botão Seguinte */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-xl font-medium text-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    Seguinte
                </button>
            </div>
        )
}

export default Pagination