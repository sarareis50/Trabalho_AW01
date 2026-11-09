import { createContext, useContext, useState } from 'react';
import initialUsers from '../data/users.json'; // Certifica-te de que o caminho para o teu json está correto

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(initialUsers);
  const [user, setUser] = useState(null); // Utilizador atualmente autenticado

  // Função de Login
  const login = (email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      return { success: true };
    }
    return { success: false, error: 'Email ou palavra-passe incorretos.' };
  };

  // Função de Registo corrigida com useState
  const register = (name, email, password) => {
    // Verificar se o email já existe
    const exists = users.some(u => u.email === email);
    if (exists) {
      return { success: false, error: 'Este email já está registado.' };
    }

    const newUser = {
      id: users.length + 1,
      name,
      email,
      password,
      role: 'USER',
    };

    // Atualiza o estado dos utilizadores e define o novo utilizador como logado
    setUsers(prevUsers => [...prevUsers, newUser]);
    setUser(newUser);
    
    return { success: true };
  };

  // Função de Logout
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, users, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/* eslint-disable react-refresh/only-export-components */
export const useAuth = () => useContext(AuthContext);