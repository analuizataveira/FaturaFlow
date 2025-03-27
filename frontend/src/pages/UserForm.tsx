'use client'
import { useState } from 'react';
import { User } from '../models/User.tsx';
import NavBar from '../components/Navbar.tsx';

export default function UserForm() {
  const [user, setUser] = useState<User>({
    id: Date.now(),
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Usuário criado:', user);
    // Aqui pode ser feita a requisição para o backend
  };

  return (
    <div>
    <NavBar page={""} />
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Criar Usuário</h2>
      </div>
      <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-900">First name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={user.firstName}
              onChange={handleChange}
              className="block w-full rounded-md px-3.5 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold text-gray-900">Last name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={user.lastName}
              onChange={handleChange}
              className="block w-full rounded-md px-3.5 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={user.email}
              onChange={handleChange}
              className="block w-full rounded-md px-3.5 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-900">Password</label>
            <input
              id="password"
              name="password"
              type="text"
              value={user.phoneNumber}
              onChange={handleChange}
              className="block w-full rounded-md px-3.5 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
            />
          </div>
        </div>
        <div className="mt-10">
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"
          >
            Criar
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
