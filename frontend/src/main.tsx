import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; // Adicione BrowserRouter
import Login from './pages/LoginForm.tsx';
import Dashboard from './pages/Dashboard.tsx';
import UserForm from './pages/UserForm.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter> {/* Adicione este componente */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/createuser" element={<UserForm/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);