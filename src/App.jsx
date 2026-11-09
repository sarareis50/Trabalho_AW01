import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Footer } from './components/footer';

// Importação das Páginas
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { EventDetails } from './pages/EventDetails';
import { EventForm } from './pages/EventForm';
import { EventRegistrations } from './pages/EventRegistrations';
import { MyRegistrations } from './pages/MyRegistrations';
import { MyEvents } from './pages/MyEvents';
import { AdminCategories } from './pages/AdminCategories';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Layout principal em Flexbox vertical com o fundo suave do DataNova */}
        <div className="min-h-screen flex flex-col justify-between bg-[#f4fafa] text-slate-800">
          
          <Navbar />

          {/* O main expande (flex-grow) para empurrar o Footer sempre para o fundo */}
          <main className="flex-grow w-full">
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/events/:id" element={<EventDetails />} />

              {/* Rotas Autenticadas */}
              <Route
                path="/events/new"
                element={
                  <ProtectedRoute>
                    <EventForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/me/registrations"
                element={
                  <ProtectedRoute>
                    <MyRegistrations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/me/events"
                element={
                  <ProtectedRoute>
                    <MyEvents />
                  </ProtectedRoute>
                }
              />

              {/* Rotas para Organizador ou Admin */}
              <Route
                path="/events/:id/edit"
                element={
                  <ProtectedRoute>
                    <EventForm isEdit />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events/:id/registrations"
                element={
                  <ProtectedRoute>
                    <EventRegistrations />
                  </ProtectedRoute>
                }
              />

              {/* Rotas de Administração */}
              <Route
                path="/admin/categories"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminCategories />
                  </ProtectedRoute>
                }
              />

              {/* Rota 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />

        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}