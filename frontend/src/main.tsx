import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/LoginForm.tsx';
import Menu from './pages/Menu.tsx';
import UserForm from './pages/UserForm.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import { ModalStackProvider } from './context/ModalContext'; // Importe o ModalStackProvider
import CostsForm from './pages/costs/CostsForm.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ModalStackProvider> {/* Adicione o provider aqui */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* Rotas protegidas */}
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
          <Route path="/costsform" element={
            <ProtectedRoute>
              <CostsForm />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </ModalStackProvider>
  </StrictMode>
);