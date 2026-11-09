import eventsData from '../data/events.json';
import categoriesData from '../data/categories.json';
import registrationsData from '../data/registrations.json';
import usersData from '../data/users.json';

// Cópia em memória para refletir alterações de imediato na interface
let events = [...eventsData];
let categories = [...categoriesData];
let registrations = [...registrationsData];
let users = [...usersData];

// --- EVENTOS ---
export const getEvents = async () => {
  return new Promise((resolve) => setTimeout(() => resolve([...events]), 200));
};

export const getEventById = async (id) => {
  return new Promise((resolve) => {
    const event = events.find((e) => e.id === Number(id));
    if (!event) return resolve(null);
    
    // Enriquecer com dados da categoria e organizador
    const category = categories.find((c) => c.id === event.categoryId);
    const organizer = users.find((u) => u.id === event.organizerId);
    const eventRegistrations = registrations.filter((r) => r.eventId === event.id);

    resolve({
      ...event,
      categoryName: category ? category.name : 'Sem Categoria',
      organizerName: organizer ? organizer.name : 'Desconhecido',
      currentRegistrationsCount: eventRegistrations.length,
      registrationsList: eventRegistrations
    });
  });
};

export const createEvent = async (eventData, userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newEvent = {
        id: events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1,
        ...eventData,
        organizerId: userId
      };
      events.push(newEvent);
      resolve(newEvent);
    }, 200);
  });
};

// --- ATUALIZAR EVENTO ---
export const updateEvent = async (id, eventData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = events.findIndex((e) => e.id === Number(id));
      if (index === -1) {
        return reject(new Error("Evento não encontrado."));
      }
      
      // Atualiza o evento mantendo o ID e o organizerId original
      events[index] = {
        ...events[index],
        ...eventData,
        id: Number(id)
      };
      
      resolve(events[index]);
    }, 200);
  });
};

// --- ELIMINAR EVENTO ---
export const deleteEvent = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const numericId = Number(id);
      // Remove o evento da lista em memória
      events = events.filter((e) => e.id !== numericId);
      // Opcional: remove também as inscrições associadas a este evento para manter a consistência
      registrations = registrations.filter((r) => r.eventId !== numericId);
      
      resolve({ success: true });
    }, 200);
  });
};

// --- INSCRIÇÕES ---
export const getRegistrations = async () => {
  return new Promise((resolve) => setTimeout(() => resolve([...registrations]), 200));
};

export const addRegistration = async (userId, eventId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Validar regras de negócio básicas aqui ou no componente
      const alreadyRegistered = registrations.find(r => r.userId === userId && r.eventId === eventId);
      if (alreadyRegistered) {
        return reject(new Error("O utilizador já está inscrito neste evento."));
      }

      const newReg = {
        id: registrations.length > 0 ? Math.max(...registrations.map(r => r.id)) + 1 : 1,
        userId,
        eventId,
        createdAt: new Date().toISOString()
      };
      registrations.push(newReg);
      resolve(newReg);
    }, 200);
  });
};

export const cancelRegistration = async (userId, eventId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      registrations = registrations.filter(r => !(r.userId === userId && r.eventId === eventId));
      resolve({ success: true });
    }, 200);
  });
};

// --- CATEGORIAS (Admin) ---
export const getCategories = async () => {
  return new Promise((resolve) => setTimeout(() => resolve([...categories]), 200));
};

export const createCategory = async (categoryData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Garante que o argumento recebido é tratado corretamente quer venha como objeto { name: "..." } ou como string
      const nameValue = typeof categoryData === 'object' && categoryData !== null ? categoryData.name : categoryData;

      const newCat = { 
        id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1, 
        name: nameValue 
      };
      
      categories.push(newCat);
      resolve(newCat);
    }, 200);
  });
};

export const deleteCategory = async (id) => {
  return new Promise((resolve, reject) => {
    // Validar se existem eventos associados
    const hasEvents = events.some(e => e.categoryId === id);
    if (hasEvents) {
      return reject(new Error("Não é possível eliminar categorias com eventos associados."));
    }
    categories = categories.filter(c => c.id !== id);
    resolve({ success: true });
  });
};

export const updateCategory = async (id, categoryData) => {
  const category = categories.find((c) => c.id === Number(id));
  if (!category) return null;

  Object.assign(category, categoryData);
  return category;
};

//"Decidi criar uma camada de serviços assíncrona com Promises para que, 
// no futuro, se quisermos ligar a aplicação a uma API REST real 
// (Node.js/Express ou Firebase), baste alterar o interior dos serviços 
// sem tocar nos componentes React."