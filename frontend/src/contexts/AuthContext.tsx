import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User } from '../models/User';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    console.log('🔁 Carregando user do localStorage:', savedUser);
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    const savedToken = localStorage.getItem('authToken');
    console.log('🔁 Carregando token do localStorage:', savedToken);
    return savedToken;
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    console.log('📦 useEffect -> token:', storedToken);
    console.log('📦 useEffect -> user:', storedUser);

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (userData: { email: string; password: string }) => {
    try {
      console.log('🚀 Enviando login com:', userData);
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Credenciais inválidas ou erro ao fazer login");
      }

      const data = await response.json();
      console.log('📥 Dados recebidos do backend:', data);

      const { token, id, email, name } = data; // Adicione mais campos conforme retornado pelo backend

      if (!token || !id) {
        throw new Error("Resposta inválida do servidor");
      }

      const loggedUser: User = {
        id,
        name: name || '',
        email: email || userData.email,
        password: '' // Não armazene a senha no estado
      };

      setUser(loggedUser);
      setToken(token);

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(loggedUser));

      console.log('✅ Login bem-sucedido!', { user: loggedUser, token });

    } catch (error) {
      console.error('❌ Erro ao fazer login:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('🚪 Realizando logout...');
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    console.log('🧹 Logout completo. Dados limpos.');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function userAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}