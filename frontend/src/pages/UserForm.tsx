'use client'

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { User } from '../models/User';
import { createUser } from '../services/UserService';

export default function UserForm() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({ 
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await createUser(user);
      
      if (response) {
        // Redireciona para login com estado para mostrar mensagem de sucesso
        navigate('/login', { state: { userCreated: true } });
      } else {
        throw new Error('Erro ao criar usuário');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Erro ao criar usuário');
      } else {
        setError('Ocorreu um erro desconhecido');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Criar Usuário
          </h2>
        </div>
        
        {error && (
          <div className="mx-auto mt-8 max-w-xl p-4 bg-red-100 text-red-700 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl sm:mt-20">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-900">
                Nome completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={user.name}
                onChange={handleChange}
                required
                minLength={3}
                className="block w-full rounded-md px-3.5 py-2 text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={user.email}
                onChange={handleChange}
                required
                className="block w-full rounded-md px-3.5 py-2 text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-900">
                Senha (mínimo 6 caracteres)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={user.password}
                onChange={handleChange}
                required
                minLength={6}
                className="block w-full rounded-md px-3.5 py-2 text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
              />
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 ${
                isLoading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
            >
              {isLoading ? 'Criando conta...' : 'Criar conta'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Já tem uma conta? Faça login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}