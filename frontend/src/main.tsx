import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/LoginForm.tsx';
import Menu from './pages/Menu.tsx';
import UserForm from './pages/UserForm.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx'; // Importe o novo componente

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Rota protegida */}
        <Route path="/menu" element={
          <ProtectedRoute>
            <Menu />
          </ProtectedRoute>
        } />
        <Route path="/createuser" element={
          <ProtectedRoute>
            <UserForm />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);