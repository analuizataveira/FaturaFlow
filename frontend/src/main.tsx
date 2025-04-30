import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/LoginForm.tsx';
import Menu from './pages/Menu.tsx';
import UserForm from './pages/UserForm.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import { ModalStackProvider } from './contexts/ModalContext.tsx';
import InvoiceForm from './pages/invoices/InvoicesForm.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ModalStackProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
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
            <Route path="/invoicesform" element={
              <ProtectedRoute>
                <InvoiceForm/>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </ModalStackProvider>
  </StrictMode>
);
